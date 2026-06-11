import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { materia } from "@/lib/db/schema"
import { buscarTutores } from "@/lib/buscar-tutores"
import InicioClient from "./InicioClient"

export default async function InicioPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  const [todasMaterias, featured] = await Promise.all([
    db.select({ id: materia.id, nome: materia.nome }).from(materia),
    buscarTutores({ page: 1, pageSize: 6 }),
  ])

  return (
    <InicioClient
      nome={session.user.name}
      materias={todasMaterias}
      tutores={featured.tutores}
    />
  )
}
