"use server"

import { db } from "@/db"
import { auth } from "@/lib/auth"
import { disponibilidade } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { z } from "zod"

const schemaAgenda = z.array(z.object({
    diaDaSemana: z.number().int().min(0).max(6),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
}))

export async function salvarAgenda(blocos: z.infer<typeof schemaAgenda>) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) return { error: "Não autenticado" }
    if (session.user.role !== "tutor") return { error: "Não autorizado" }

    const parsed = schemaAgenda.safeParse(blocos)
    if (!parsed.success) return { error: "Dados inválidos" }

    const tutorId = session.user.id

    await db.delete(disponibilidade).where(eq(disponibilidade.tutorId, tutorId))

    if (parsed.data.length > 0) {
        await db.insert(disponibilidade).values(
            parsed.data.map(bloco => ({
                tutorId,
                diaDaSemana: bloco.diaDaSemana,
                startTime: bloco.startTime,
                endTime: bloco.endTime,
                isAtivo: true,
            }))
        )
    }

    revalidatePath("/perfil")
    return { success: true }
}