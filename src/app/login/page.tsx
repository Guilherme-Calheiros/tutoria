"use client"

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaAngleLeft, FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import Link from "next/link";
import { FormLoginSchema, schemaLogin } from "@/schemas/login";
import PasswordInput from "../components/PasswordInput";
import ResetPasswordDialog from "../components/ResetPasswordDialog";
import Mensagem from "../components/Mensagem";

export default function LoginPage() {

    const router = useRouter();
    const [mensagem, setMensagem] = useState<{ type: "sucesso" | "erro"; text: string } | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<FormLoginSchema>({
        resolver: zodResolver(schemaLogin)
    });

    const handleFormSubmit = async (data: FormLoginSchema) => {
        setMensagem(null)
        const { email, senha } = data

        const { error: authError } = await authClient.signIn.email({
            email,
            password: senha,
        })

        if (authError) {
            setMensagem({ type: "erro", text: "E-mail ou senha inválidos." })
            return
        }

        router.push(`/inicio`)
    };

    return (
        <main className="bg-background min-h-screen flex flex-col items-center p-2">

            <section className="w-full max-w-5xl flex flex-col items-center">
                <Link href="/cadastro" className="self-start flex items-center gap-1 text-primary min-h-11">
                    <FaAngleLeft className="text-xl" />
                    <span className="text-sm">Retornar</span>
                </Link>
                <div className="flex flex-col items-center justify-center mt-6">
                    <h1 className="text-3xl sm:text-5xl font-bold text-primary tracking-tight">
                        Login
                    </h1>
                </div>
                <section className="w-full max-w-lg border border-border rounded-xl p-8 bg-background mt-8">
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="text-sm font-medium text-foreground">
                                Email
                            </label>
                            <input id="email" type="email" placeholder="seu@email.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "erro-email" : undefined} {...register('email')} className="field-default" />
                            {errors.email && <p id="erro-email" role="alert" className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="senha" className="text-sm font-medium text-foreground">
                                Senha
                            </label>
                            <PasswordInput id="senha" placeholder="Minimo 8 caracteres" aria-invalid={!!errors.senha} aria-describedby={errors.senha ? "erro-senha" : undefined} {...register("senha")} />
                            {errors.senha && <p id="erro-senha" role="alert" className="text-destructive text-sm mt-1">{errors.senha.message}</p>}
                            <button type="button" onClick={() => setDialogOpen(true)} className="text-xs text-primary hover:text-primary/80 transition-colors mt-1 self-end">
                                Esqueci minha senha
                            </button>
                        </div>
                        {mensagem && <Mensagem type={mensagem.type} message={mensagem.text} onClose={() => setMensagem(null)} />}
                        <button type="submit" disabled={isSubmitting} className="bg-primary p-2 min-h-11 font-semibold rounded-lg text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4 transition-colors">
                            {isSubmitting ? "Entrando..." : "Entrar"}
                        </button>
                
                        <div className="flex justify-center text-xs text-muted-foreground bg-background px-2">
                            ou
                        </div>
                        <button
                            type="button"
                            onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/inicio" })}
                            className="flex items-center justify-center gap-2 min-h-11 border border-border rounded-lg px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
                        >
                            <FaGoogle />
                            Continuar com Google
                        </button>
                    </form>
                </section>
                <p className="mt-6 text-sm text-muted-foreground">
                    Não tem uma conta?{" "}
                    <Link href="/cadastro" className="text-primary font-medium hover:text-primary/80 transition-colors">
                        Criar conta
                    </Link>
                </p>
                <ResetPasswordDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    defaultEmail={getValues("email")}
                />
            </section>
        </main>
    )
}
