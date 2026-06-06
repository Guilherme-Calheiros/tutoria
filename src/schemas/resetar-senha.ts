import { z } from "zod";

export type FormResetarSenhaSchema = z.infer<typeof schemaResetarSenha>;

export const schemaResetarSenha = z.object({
    novaSenha: z.string().min(8, "A senha deve conter pelo menos 8 caracteres"),
});
