"use server"

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { account } from "@/lib/db/auth-schema";
import { and, eq, isNotNull } from "drizzle-orm";
import { headers } from "next/headers";

export async function verificarTemSenha() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) return { temSenha: false };

    const [conta] = await db
        .select()
        .from(account)
        .where(and(
            eq(account.userId, session.user.id),
            isNotNull(account.password)
        ))
        .limit(1);

    return { temSenha: !!conta };
}

export async function criarSenha(newPassword: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return { success: false, error: "Usuário não autenticado" };
    }

    try {
        await auth.api.setPassword({
            body: { newPassword },
            headers: await headers()
        });
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erro ao criar senha"
        };
    }
}
