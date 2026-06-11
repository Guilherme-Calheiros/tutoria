import { db } from "@/db"
import { and, asc, desc, eq, exists, inArray, or, sql } from "drizzle-orm"
import { tutor, materia, materiaTutor, nivelEnsino, nivelEnsinoTutor, enderecoAtendimento, disponibilidade } from "@/lib/db/schema"
import { user } from "@/lib/db/auth-schema"

export type TutorResult = {
  userId: string
  nome: string
  image: string | null
  telefone: string | null
  descricao: string | null
  modalidade: "ead" | "presencial" | "ambos"
  valorHora: string | null
  voluntario: boolean
  materias: { id: number; nome: string }[]
  niveis: { id: number; nome: string }[]
  enderecos: { bairro: string; cidade: string; estado: string }[]
}

export type BuscarResult = {
  tutores: TutorResult[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

type BuscarParams = {
  q?: string
  materias?: number[]
  niveis?: number[]
  modalidade?: string
  voluntario?: boolean
  precoMax?: string
  cidade?: string
  dias?: number[]
  horaInicio?: string
  horaFim?: string
  page?: number
  pageSize?: number
}

function parsePreco(valor: string) {
  const normalized = valor
    .trim()
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.]/g, "")

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

export async function buscarTutores(params: BuscarParams = {}): Promise<BuscarResult> {
  const {
    q = "",
    materias: materiaIds = [],
    niveis: nivelIds = [],
    modalidade = "todos",
    voluntario = false,
    precoMax = "",
    cidade = "",
    dias = [],
    horaInicio = "",
    horaFim = "",
    page = 1,
    pageSize = 8,
  } = params

  const diasUnicos = [...new Set(dias)]
  const materiasUnicas = [...new Set(materiaIds)]
  const niveisUnicos = [...new Set(nivelIds)]
  const safePageSize = Math.max(1, pageSize)

  const conditions = [eq(tutor.perfilCompleto, true)]

  if (modalidade === "ead") {
    conditions.push(inArray(tutor.modalidade, ["ead", "ambos"]))
  } else if (modalidade === "presencial") {
    conditions.push(inArray(tutor.modalidade, ["presencial", "ambos"]))
  }

  if (voluntario) {
    conditions.push(eq(tutor.voluntario, true))
  }

  if (materiasUnicas.length > 0) {
    conditions.push(
      exists(
        db
          .select({x: sql`1`})
          .from(materiaTutor)
          .where(
            and(
              eq(materiaTutor.tutorId, tutor.userId),
              inArray(materiaTutor.materiaId, materiasUnicas)
            )
          )
          .groupBy(materiaTutor.tutorId)
          .having(
            sql`count(distinct ${materiaTutor.materiaId}) = ${materiasUnicas.length}`
          )
      )
    )
  }

  if (niveisUnicos.length > 0) {
    conditions.push(
      exists(
        db
          .select({x: sql`1`})
          .from(nivelEnsinoTutor)
          .where(
            and(
              eq(nivelEnsinoTutor.tutorId, tutor.userId),
              inArray(nivelEnsinoTutor.nivelEnsinoId, niveisUnicos)
            )
          )
          .groupBy(nivelEnsinoTutor.tutorId)
          .having(
            sql`count(distinct ${nivelEnsinoTutor.nivelEnsinoId}) = ${niveisUnicos.length}`
          )
      )
    )
  }

  if (cidade.trim()) {
    const pattern = `%${cidade.trim().toLowerCase()}%`
    conditions.push(
      exists(
        db
          .select({ x: sql`1` })
          .from(enderecoAtendimento)
          .where(
            and(
              eq(enderecoAtendimento.tutorId, tutor.userId),
              sql`unaccent(LOWER(${enderecoAtendimento.cidade})) LIKE unaccent(${pattern})`
            )
          )
      )
    )
  }

  const preco = parsePreco(precoMax)
  if (preco !== null) {
    conditions.push(
      sql`(${tutor.voluntario} = true OR ${tutor.valorHora} IS NULL OR ${tutor.valorHora} <= ${preco})`
    )
  }

  if (diasUnicos.length > 0) {
    conditions.push(
      exists(
        db
          .select({tutorId: disponibilidade.tutorId})
          .from(disponibilidade)
          .where(
            and(
              eq(disponibilidade.tutorId, tutor.userId),
              eq(disponibilidade.isAtivo, true),
              inArray(disponibilidade.diaDaSemana, diasUnicos)
            )
          )
          .groupBy(disponibilidade.tutorId)
          .having(
            sql`count(distinct ${disponibilidade.diaDaSemana}) = ${diasUnicos.length}`
          )
      )
    )
  }

  if (horaInicio && horaFim) {
    conditions.push(
      exists(
        db
          .select({ x: sql`1` })
          .from(disponibilidade)
          .where(
            and(
              eq(disponibilidade.tutorId, tutor.userId),
              eq(disponibilidade.isAtivo, true),
              sql`${disponibilidade.startTime} <= ${horaInicio}`,
              sql`${disponibilidade.endTime} >= ${horaFim}`
            )
          )
      )
    )
  }

  if (q.trim()) {
    const pattern = `%${q.trim().toLowerCase()}%`
    conditions.push(
      sql`(
        EXISTS (
          SELECT 1 FROM ${user} WHERE ${user.id} = ${tutor.userId} AND unaccent(LOWER(${user.name})) LIKE unaccent(${pattern})
        )
        OR EXISTS (
          SELECT 1 FROM ${enderecoAtendimento}
          WHERE ${enderecoAtendimento.tutorId} = ${tutor.userId}
          AND unaccent(LOWER(${enderecoAtendimento.cidade})) LIKE unaccent(${pattern})
        )
        OR EXISTS (
          SELECT 1 FROM ${materiaTutor}
          JOIN ${materia} ON ${materiaTutor.materiaId} = ${materia.id}
          WHERE ${materiaTutor.tutorId} = ${tutor.userId}
          AND unaccent(LOWER(${materia.nome})) LIKE unaccent(${pattern})
        )
        OR EXISTS (
          SELECT 1 FROM ${nivelEnsinoTutor}
          JOIN ${nivelEnsino} ON ${nivelEnsinoTutor.nivelEnsinoId} = ${nivelEnsino.id}
          WHERE ${nivelEnsinoTutor.tutorId} = ${tutor.userId}
          AND unaccent(LOWER(${nivelEnsino.nome})) LIKE unaccent(${pattern})
        )
        OR unaccent(LOWER(${tutor.descricao})) LIKE unaccent(${pattern})
      )`
    )
  }

  const whereClause = and(...conditions)

  const [countRow] =
    await db
      .select({
        count: sql<number>`count(*)`
      })
      .from(tutor)
      .where(whereClause)

  const total = Number(countRow?.count ?? 0)
  const totalPages = Math.max(1, Math.ceil(total / safePageSize))
  const safePage = Math.max(1, Math.min(page, totalPages))
  const offset = (safePage - 1) * safePageSize

  const idRows =
    await db
      .select({userId: tutor.userId})
      .from(tutor)
      .where(whereClause)
      .orderBy(desc(tutor.voluntario), asc(tutor.valorHora))
      .limit(safePageSize)
      .offset(offset)

  const tutorIds = idRows.map(x => x.userId)

  if (tutorIds.length === 0) {
    return { tutores: [], total, page: safePage, pageSize: safePageSize, totalPages}
  }

  const results =
    await db
      .query
      .tutor
      .findMany({
        where:
          inArray(tutor.userId, tutorIds),
        with: {
          user: true,
          materias: {
            with: {
              materia: true
            }
          },
          niveisEnsino: {
            with: {
              nivelEnsino: true
            }
          },
          enderecos: true,
        }
      })

  const orderMap = new Map(tutorIds.map((id, i) => [id, i]))

  results.sort(
    (a, b) => (orderMap.get(a.userId) ?? 0) - (orderMap.get(b.userId) ?? 0)
  )

  const tutores =
    results.map(
      t => ({
        userId: t.userId,
        nome: t.user.name,
        image: t.user.image,
        telefone: t.user.telefone,
        descricao: t.descricao,
        modalidade: t.modalidade,
        valorHora: t.valorHora,
        voluntario: t.voluntario,
        materias: t.materias.map(m => ({
            id: m.materia.id,
            nome: m.materia.nome
          })
        ),
        niveis: t.niveisEnsino.map(n => ({
            id: n.nivelEnsino.id,
            nome: n.nivelEnsino.nome
          })
        ),
        enderecos: t.enderecos.map(e => ({
            bairro: e.bairro,
            cidade: e.cidade,
            estado: e.estado,
          })
        )
      })
    )

  return {
    tutores,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  }
}