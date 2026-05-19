"use server"

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { user } from "@/lib/db/auth-schema";
import { enderecoAtendimento, materiaTutor, nivelEnsinoTutor, tutor } from "@/lib/db/schema";
import { SchemaPerfil, schemaPerfil } from "@/schemas/perfil";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { deleteArquivo } from "@/lib/r2/r2";

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
        image,
        descricao,
        ensinaPrivado,
        ensinaTurma,
        modalidade,
        valorHora,
        voluntario,
        materias,
        niveisEnsino,
        enderecos
    } = parsed.data

    const atualizacoesUser: Record<string, unknown> = {}
    if (nome !== undefined) atualizacoesUser.name = nome
    if (telefone !== undefined) atualizacoesUser.telefone = telefone
    if (image) {
        const [usuarioAtual] = await db.select({ image: user.image }).from(user).where(eq(user.id, id))
        if (usuarioAtual?.image && usuarioAtual.image.startsWith(process.env.R2_PUBLIC_URL!)) {
            const oldKey = usuarioAtual.image.replace(`${process.env.R2_PUBLIC_URL}/`, "")
            await deleteArquivo(oldKey)
        }
        atualizacoesUser.image = image
    }

    if (Object.keys(atualizacoesUser).length > 0){
        await db.update(user).set(atualizacoesUser).where(eq(user.id, id));
    }

    if(session.user.role === "tutor"){

        const atualizacoesTutor: Record<string, unknown> = {}
        if (descricao !== undefined) atualizacoesTutor.descricao = descricao
        if (modalidade !== undefined) atualizacoesTutor.modalidade = modalidade
        if (ensinaPrivado !== undefined) atualizacoesTutor.ensinaPrivado = ensinaPrivado
        if (ensinaTurma !== undefined) atualizacoesTutor.ensinaTurma = ensinaTurma
        if (voluntario !== undefined) {
            atualizacoesTutor.voluntario = voluntario
            if (voluntario) {
                atualizacoesTutor.valorHora = null
            }
        }
        if (!voluntario && valorHora !== undefined) {
            atualizacoesTutor.valorHora = valorHora || null
        }

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

        if (enderecos !== undefined){
            const enderecosAtuais = await db
                .select()
                .from(enderecoAtendimento)
                .where(eq(enderecoAtendimento.tutorId, id))

            const idAtuais = enderecosAtuais.map(e => e.id)
            const idNovos = enderecos.filter(e => e.id !== undefined).map(e => e.id)
            const paraRemover = idAtuais.filter(id => !idNovos.includes(id))

            if(paraRemover.length > 0){
                await db.delete(enderecoAtendimento).where(
                    and(
                        eq(enderecoAtendimento.tutorId, id),
                        inArray(enderecoAtendimento.id, paraRemover)
                    )
                )
            }
            
            for (const endereco of enderecos) {
                if (endereco.id) {
                    await db.update(enderecoAtendimento)
                        .set({
                            bairro: endereco.bairro,
                            cidade: endereco.cidade,
                            estado: endereco.estado,
                        })
                        .where(eq(enderecoAtendimento.id, endereco.id))
                } else {
                    await db.insert(enderecoAtendimento).values({
                        tutorId: id,
                        bairro: endereco.bairro,
                        cidade: endereco.cidade,
                        estado: endereco.estado,
                    })
                }
            }
        }
    }

    revalidatePath("/perfil")
    return {success: true}
    
}