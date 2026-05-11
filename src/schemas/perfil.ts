import { z } from "zod"

export const schemaPerfil = z.object({
    nome: z.string().min(2, "Nome deve conter pelo menos 2 caracteres").optional(),
    telefone: z.string().optional(),
    descricao: z.string().min(10, "Descrição deve conter pelo menos 10 caracteres").optional(),
    modalidade: z.enum(["ead", "presencial", "ambos"]).optional(),
    ensinaTurma: z.boolean().optional(),
    ensinaPrivado: z.boolean().optional(),
    valorHora: z.string().optional(),
    voluntario: z.boolean().optional(),
    materias: z.array(z.number()).optional(),
    niveisEnsino: z.array(z.number()).optional(),
}).superRefine((data, ctx) => {
    if (data.ensinaPrivado !== undefined && data.ensinaTurma !== undefined) {
        if (!data.ensinaPrivado && !data.ensinaTurma) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Selecione pelo menos um tipo de atendimento",
                path: ["ensinaPrivado"]
            })
        }
    }

    if (data.voluntario && data.valorHora) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Voluntários não devem possuir valor por hora.",
            path: ["valorHora"]
        })
    }
})

export type SchemaPerfil = z.infer<typeof schemaPerfil>