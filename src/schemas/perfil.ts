import { z } from "zod"

export const schemaPerfil = z.object({
    nome: z.string().min(2, "Nome deve conter pelo menos 2 caracteres").optional(),
    telefone: z.string().optional(),
    image: z.string().optional(),
    descricao: z.string().min(10, "Descrição deve conter pelo menos 10 caracteres").optional(),
    modalidade: z.enum(["ead", "presencial", "ambos"]).optional(),
    ensinaTurma: z.boolean().optional(),
    ensinaPrivado: z.boolean().optional(),
    valorHora: z.string().optional(),
    voluntario: z.boolean().optional(),
    materias: z.array(z.number()).optional(),
    niveisEnsino: z.array(z.number()).optional(),
    enderecos: z.array(z.object({
        id: z.number().optional(),
        bairro: z.string().min(1, "Bairro obrigatório"),
        cidade: z.string().min(1, "Cidade obrigatória"),
        estado: z.string().min(2, "Estado obrigatório"),
    })).optional()
}).superRefine((data, ctx) => {
    if (data.ensinaPrivado !== undefined && data.ensinaTurma !== undefined) {
        if (!data.ensinaPrivado && !data.ensinaTurma) {
            ctx.addIssue({
                code: "custom",
                message: "Selecione pelo menos um tipo de atendimento",
                path: ["ensinaPrivado"]
            })
        }
    }

    if (data.modalidade === "ambos" || data.modalidade === "presencial"){
        if (!data.enderecos) {
            ctx.addIssue({
                code: "custom",
                message: "Preencha todos os campos de endereço",
                path: ["enderecos"]
            })
        }
    }

    if (data.voluntario && data.valorHora) {
        ctx.addIssue({
            code: "custom",
            message: "Voluntários não devem possuir valor por hora.",
            path: ["valorHora"]
        })
    }
})

export const schemaPerfilTutor = schemaPerfil.superRefine((data, ctx) => {
    if (!data.descricao || data.descricao.length < 10) {
        ctx.addIssue({ code: "custom", message: "Descrição deve conter pelo menos 10 caracteres", path: ["descricao"] })
    }
    if (!data.telefone || data.telefone.length < 10) {
        ctx.addIssue({ code: "custom", message: "Celular é obrigatório", path: ["telefone"] })
    }
    if (!data.materias?.length) {
        ctx.addIssue({ code: "custom", message: "Selecione pelo menos uma matéria", path: ["materias"] })
    }
    if (!data.niveisEnsino?.length) {
        ctx.addIssue({ code: "custom", message: "Selecione pelo menos um nível de ensino", path: ["niveisEnsino"] })
    }
    if ((data.modalidade === "presencial" || data.modalidade === "ambos") && (!data.enderecos || data.enderecos.length === 0)) {
        ctx.addIssue({ code: "custom", message: "Adicione pelo menos um endereço de atendimento", path: ["enderecos"] })
    }
})

export type SchemaPerfil = z.infer<typeof schemaPerfil>