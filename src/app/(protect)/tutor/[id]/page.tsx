import { db } from "@/db"
import { auth } from "@/lib/auth"
import { disponibilidade, tutor } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import TutorProfileClient from "./TutorProfileClient"

export default async function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        redirect("/login")
    }

    const tutorData = await db.query.tutor.findFirst({
        where: eq(tutor.userId, id),
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
            disponibilidades: {
                where: eq(disponibilidade.isAtivo, true)
            }
        }
    })

    if (!tutorData || !tutorData.perfilCompleto) {
        notFound()
    }

    return (
        <TutorProfileClient
            userId={tutorData.userId}
            nome={tutorData.user.name}
            image={tutorData.user.image}
            telefone={tutorData.user.telefone}
            descricao={tutorData.descricao}
            modalidade={tutorData.modalidade}
            ensinaPrivado={tutorData.ensinaPrivado}
            ensinaTurma={tutorData.ensinaTurma}
            valorHora={tutorData.valorHora}
            voluntario={tutorData.voluntario}
            materias={tutorData.materias.map(m => ({ id: m.materia.id, nome: m.materia.nome }))}
            niveis={tutorData.niveisEnsino.map(n => ({ id: n.nivelEnsino.id, nome: n.nivelEnsino.nome }))}
            enderecos={tutorData.enderecos.map(e => ({ bairro: e.bairro, cidade: e.cidade, estado: e.estado }))}
            disponibilidades={tutorData.disponibilidades.map(d => ({
                diaDaSemana: d.diaDaSemana,
                startTime: d.startTime,
                endTime: d.endTime,
            }))}
        />
    )
}
