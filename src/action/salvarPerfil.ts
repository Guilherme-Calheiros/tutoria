"use server"

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { user } from "@/lib/db/auth-schema";
import { materiaTutor, nivelEnsino, nivelEnsinoTutor, tutor } from "@/lib/db/schema";
import { SchemaPerfil, schemaPerfil } from "@/schemas/perfil";
import { error } from "console";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { includes, success } from "zod";

export async function salvarPerfil(id: string, data: Partial<SchemaPerfil>){
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if(!session){
        return {
            success: false,
            error: "Usuário não autenticado"
        };
    }

    if(session.user.id !== id){
        return {
            success: false,
            error: "Usuário não autorizado"
        };
    }

    const parsed = schemaPerfil.safeParse(data)
    if(!parsed.success){
        return {
            success: false,
            error: parsed.error.message
        };
    }

    const {
        nome,
        telefone,
        descricao,
        ensinaPrivado,
        ensinaTurma,
        modalidade,
        valorHora,
        materias,
        niveisEnsino
    } = parsed.data

    const atualizacoesUser: Record<string, unknown> = {}
    if (nome !== undefined) atualizacoesUser.nome = nome
    if (telefone !== undefined) atualizacoesUser.telefone = telefone

    if (Object.keys(atualizacoesUser).length > 0){
        await db.update(user).set(atualizacoesUser).where(eq(user.id, id));
    }

    if(session.user.role === "tutor"){

        const atualizacoesTutor: Record<string, unknown> = {}
        if (descricao !== undefined) atualizacoesTutor.descricao = descricao
        if (modalidade !== undefined) atualizacoesTutor.modalidade = modalidade
        if (ensinaPrivado !== undefined) atualizacoesTutor.ensinaPrivado = ensinaPrivado
        if (ensinaTurma !== undefined) atualizacoesTutor.ensinaTurma = ensinaTurma
        if (valorHora !== undefined) atualizacoesTutor.valorHora = valorHora ?? null

        if (Object.keys(atualizacoesTutor).length > 0){
            await db.update(tutor).set(atualizacoesTutor).where(eq(tutor.userId, id));
        }

        if(materias !== undefined){
            const materiasAtuais = await db
                .select({materiaId: materiaTutor.materiaId})
                .from(materiaTutor)
                .where(eq(materiaTutor.tutorId, id))

            const idAtuais = materiasAtuais.map(m => m.materiaId)
            const paraAdicionar = materias.filter(m => !idAtuais.includes(m))
            const paraRemover = idAtuais.filter(m => !materias.includes(m))

            if (paraRemover.length > 0){
                await db.delete(materiaTutor).where(
                    and(
                        eq(materiaTutor.tutorId, id),
                        inArray(materiaTutor.materiaId, paraRemover)
                    )
                )
            }

            if (paraAdicionar.length > 0){
                await db.insert(materiaTutor).values(
                    paraAdicionar.map(materiaId => ({ tutorId: id, materiaId }))
                )
            }
        }

        if(niveisEnsino !== undefined){
            const niveisAtuais = await db
                .select({nivelEnsinoId: nivelEnsinoTutor.nivelEnsinoId})
                .from(nivelEnsinoTutor)
                .where(eq(nivelEnsinoTutor.tutorId, id))

            const idAtuais = niveisAtuais.map(n => n.nivelEnsinoId)
            const paraAdicionar = niveisEnsino.filter(n => !idAtuais.includes(n))
            const paraRemover = idAtuais.filter(n => !niveisEnsino.includes(n))

            if (paraRemover.length > 0){
                await db.delete(nivelEnsinoTutor).where(
                    and(
                        eq(nivelEnsinoTutor.tutorId, id),
                        inArray(nivelEnsinoTutor.nivelEnsinoId, paraRemover)
                    )
                )
            }

            if (paraAdicionar.length > 0){
                await db.insert(nivelEnsinoTutor).values(
                    paraAdicionar.map(nivelEnsinoId => ({ tutorId: id, nivelEnsinoId }))
                )
            }
        }
    }

    revalidatePath("/perfil")
    return {success: true}
    
}