import { db } from "@/db"
import { auth } from "@/lib/auth"
import { materia, nivelEnsino, tutor } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import OnboardingClient from "./OnboardingClient"

export default async function OnboardingPage() {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        redirect("/login")
    }

    if (session.user.role !== "tutor") {
        redirect("/")
    }

    const tutorResult = await db.query.tutor.findFirst({
        where: eq(tutor.userId, session.user.id),
        with: {
            enderecos: true,
        }
    })

    if (tutorResult?.onboardingCompleto) {
        redirect("/perfil")
    }

    const tutorData = tutorResult ? {
        descricao: tutorResult.descricao,
        modalidade: tutorResult.modalidade,
        ensinaTurma: tutorResult.ensinaTurma,
        ensinaPrivado: tutorResult.ensinaPrivado,
        valorHora: tutorResult.valorHora,
        voluntario: tutorResult.voluntario,
        materias: [] as number[],
        niveisEnsino: [] as number[],
        enderecos: tutorResult.enderecos,
    } : null

    const todasMaterias = await db.select().from(materia)
    const todosNiveisEnsino = await db.select().from(nivelEnsino)

    return (
        <OnboardingClient
            userId={session.user.id}
            nome={session.user.name}
            telefone={session.user.telefone ?? null}
            tutorData={tutorData}
            todasMaterias={todasMaterias}
            todosNiveisEnsino={todosNiveisEnsino}
        />
    )
}
