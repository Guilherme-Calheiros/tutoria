import { z } from "zod";

export type FormAlterarSenhaSchema = z.infer<typeof schemaAlterarSenha>;

export const schemaAlterarSenha = z.object({
    senhaAtual: z.string().min(8, "A senha deve conter pelo menos 8 caracteres"),
    novaSenha: z.string().min(8, "A senha deve conter pelo menos 8 caracteres"),
}).superRefine((data, ctx) => {
    if (data.senhaAtual === data.novaSenha) {
        ctx.addIssue({
            code: "custom",
            message: "A nova senha deve ser diferente da atual",
            path: ["novaSenha"]
        });
    }
});
