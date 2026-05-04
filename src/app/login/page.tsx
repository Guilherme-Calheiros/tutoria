"use client"

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import Link from "next/link";
import { FormLoginSchema, schemaLogin } from "@/schemas/login";
import PasswordInput from "../components/PasswordInput";



export default function LoginPage() {

    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormLoginSchema>({
        resolver: zodResolver(schemaLogin)
    });

    const handleFormSubmit = async (data: FormLoginSchema) => {
        setError(null)
        const { email, senha } = data

        const { error: authError } = await authClient.signIn.email({
            email,
            password: senha,
        })

        if (authError) {
            console.log(authError)
            handleSetError("E-mail ou senha inválidos.")
            return
        }

        router.push(`/inicio`)
    };

    const handleSetError = (message: string) => {
        setError(message)
        setTimeout(() => {
            setError(null)
        }, 5000)
    }

    return (
        <main className="bg-background min-h-screen flex flex-col items-center p-2">

            <div className="flex flex-col items-center justify-center mt-10">
                <h1 className="text-3xl sm:text-5xl font-bold text-primary tracking-tight">
                    Login
                </h1>
            </div>

            <section className="w-full max-w-md border border-border rounded-2xl p-8 bg-background mt-8 shadow">
                <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                            Email
                        </label>
                        <input id="email" type="email" placeholder="seu@email.com" {...register('email')} className="border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="senha" className="text-sm font-medium text-foreground">
                            Senha
                        </label>
                        <PasswordInput id="senha" placeholder="Minimo 8 caracteres" {...register("senha")} />
                        {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>}
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                        {error}
                        </p>
                    )}

                    <button type="submit" className="bg-primary p-2 font-semibold rounded-lg text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-4">
                        {isSubmitting ? "Entrando..." : "Entrar"}
                    </button>

                    
                    <div className="flex justify-center text-xs text-muted-foreground bg-background px-2">
                        ou
                    </div>


                    <button
                        type="button"
                        onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/inicio" })}
                        className="flex items-center justify-center gap-2 border border-border rounded-lg px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                        <FaGoogle />
                        Continuar com Google
                    </button>
                </form>
            </section>

            <p className="mt-6 text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link href="/cadastro" className="text-primary font-medium hover:underline">
                    Criar conta
                </Link>
            </p>
        </main>
    )
}