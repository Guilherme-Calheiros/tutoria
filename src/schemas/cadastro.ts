import { z } from "zod";

export type FormCadastroSchema = z.infer<typeof schemaCadastro>;

export const schemaCadastro = z.object({
    nome: z.string().min(2, "Nome deve conter pelo menos 2 caracteres"),
    email: z.email("Email inválido"),
    telefone: z.string().optional(),
    senha: z.string().min(8, "A senha deve conter pelo menos 8 caracteres"),
    confirmarSenha: z.string().min(8, "A senha deve conter pelo menos 8 caracteres"),
    role: z.enum(['tutor', 'aluno'])
}).superRefine((data, ctx) => {
    if (data.senha !== data.confirmarSenha) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "As senhas não coincidem",
            path: ["confirmarSenha"]
        });
    }
});