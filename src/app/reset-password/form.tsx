"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { FormResetarSenhaSchema, schemaResetarSenha } from "@/schemas/resetar-senha";
import PasswordInput from "@/app/components/PasswordInput";
import Mensagem from "@/app/components/Mensagem";

type ResetPasswordFormProps = {
    token: string
    router: AppRouterInstance
}

export function ResetPasswordForm({ token, router }: ResetPasswordFormProps) {
    const [mensagem, setMensagem] = useState<{ type: "sucesso" | "erro"; text: string } | null>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormResetarSenhaSchema>({
        resolver: zodResolver(schemaResetarSenha)
    });

    const handleFormSubmit = async (data: FormResetarSenhaSchema) => {
        setMensagem(null);

        const { error: authError } = await authClient.resetPassword({
            newPassword: data.novaSenha,
            token,
        });

        if (authError) {
            setMensagem({ type: "erro", text: authError.message ?? "Ocorreu um erro ao redefinir a senha." });
            return;
        }

        router.push("/login?senha_redefinida=true");
    };

    return (
        <main className="bg-background min-h-screen flex flex-col items-center p-2">
            <div className="flex flex-col items-center justify-center mt-10">
                <h1 className="text-3xl sm:text-5xl font-bold text-primary tracking-tight">
                    Redefinir senha
                </h1>
            </div>

            <section className="w-full max-w-md border border-border rounded-2xl p-8 bg-background mt-8 shadow">
                <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="novaSenha" className="text-sm font-medium text-foreground">
                            Nova senha
                        </label>
                        <PasswordInput id="novaSenha" placeholder="Mínimo 8 caracteres" {...register("novaSenha")} />
                        {errors.novaSenha && <p className="text-red-500 text-sm mt-1">{errors.novaSenha.message}</p>}
                    </div>

                    {mensagem && <Mensagem type={mensagem.type} message={mensagem.text} onClose={() => setMensagem(null)} />}

                    <button type="submit" className="bg-primary p-2 font-semibold rounded-lg text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-4">
                        {isSubmitting ? "Redefinindo..." : "Redefinir senha"}
                    </button>
                </form>
            </section>
        </main>
    )
}
