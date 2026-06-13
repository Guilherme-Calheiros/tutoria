import { Suspense } from "react"
import { db } from "@/db"
import { auth } from "@/lib/auth"
import { materia, nivelEnsino } from "@/lib/db/schema"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { buscarTutores } from "@/lib/buscar-tutores"
import BuscarClient from "./BuscarClient"

export default async function BuscarPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  const [todasMaterias, todosNiveis, initialData] = await Promise.all([
    db.select().from(materia),
    db.select().from(nivelEnsino),
    buscarTutores({ page: 1, pageSize: 8 }),
  ])

  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-20 text-center text-muted-foreground text-sm">
          Carregando...
        </div>
      }
    >
      <BuscarClient
        todasMaterias={todasMaterias}
        todosNiveis={todosNiveis}
        initialData={initialData}
      />
    </Suspense>
  )
}
