import { z } from "zod";

export type FormLoginSchema = z.infer<typeof schemaLogin>;

export const schemaLogin = z.object({
    email: z.email("Email inválido"),
    senha: z.string().min(8, "A senha deve conter pelo menos 8 caracteres"),
});