import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "@/db"
import { tutor } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return NextResponse.json({ notificacoes: [] })
    }

    const notificacoes: {
        id: string
        tipo: string
        mensagem: string
        link: string
    }[] = []

    if (session.user.role === "tutor") {
        const [result] = await db
            .select({ perfilCompleto: tutor.perfilCompleto })
            .from(tutor)
            .where(eq(tutor.userId, session.user.id))

        if (result && !result.perfilCompleto) {
            notificacoes.push({
                id: "perfil_incompleto",
                tipo: "perfil_incompleto",
                mensagem: "Complete seu perfil para aparecer nas buscas",
                link: "/perfil",
            })
        }
    }

    return NextResponse.json({ notificacoes })
}
