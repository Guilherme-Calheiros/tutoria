import { db } from "@/db"
import { auth } from "@/lib/auth"
import { materia, nivelEnsino, tutor } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import ProfileClient from "./ProfileClient"

export default async function ProfilePage() {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        redirect("/login")
    }

    const user = session.user

    let tutorData = null
    if (session.user.role === "tutor") {
        const tutorResult = await db.query.tutor.findFirst({
            where: eq(tutor.userId, session.user.id),
            with: {
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
                disponibilidades: true
            }
        });

        tutorData = tutorResult ? {
            descricao: tutorResult.descricao,
            modalidade: tutorResult.modalidade,
            ensinaTurma: tutorResult.ensinaTurma,
            ensinaPrivado: tutorResult.ensinaPrivado,
            valorHora: tutorResult.valorHora,
            voluntario: tutorResult.voluntario,
            enderecos: tutorResult.enderecos,
            materias: tutorResult.materias.map(tm => tm.materiaId),
            niveisEnsino: tutorResult.niveisEnsino.map(tn => tn.nivelEnsinoId),
            disponibilidades: tutorResult.disponibilidades.map(d => ({
                diaDaSemana: d.diaDaSemana,
                startTime: d.startTime,
                endTime: d.endTime,
            })),
        } : null
    }

    const todasMaterias = await db.select().from(materia)
    const todosNiveisEnsino = await db.select().from(nivelEnsino)

    return (
        <ProfileClient 
            userId={user.id}
            nome={user.name}
            telefone={user.telefone ?? null}
            image={user.image ?? null}
            role={user.role}
            tutorData={tutorData}
            todasMaterias={todasMaterias}
            todosNiveisEnsino={todosNiveisEnsino}
        />
    )
}