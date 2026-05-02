"use client"

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import { FormCadastroSchema, schemaCadastro } from "@/schemas/cadastro";
import { useState } from "react";
import Link from "next/link";

interface FormCadastroProps {
    tipo: 'tutor' | 'aluno';
}

const configCadastro = {
    tutor: {
        title: "Quero Ensinar",
        description: "Cadastre-se como tutor e conecte-se com alunos",
        role: "tutor"
    },
    aluno: {
        title: "Quero Aprender",
        description: "Quero encontrar um tutor para me ajudar a aprender.",
        role: "aluno"
    }
}

export default function FormCadastro({ tipo }: FormCadastroProps) {

    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const { title, description, role } = configCadastro[tipo];
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormCadastroSchema>({
        resolver: zodResolver(schemaCadastro)
    });

    const handleFormSubmit = async (data: FormCadastroSchema) => {
        setError(null)
        const { nome, email, telefone, senha } = data

        const { error: authError } = await authClient.signUp.email({
            name: nome,
            email,
            password: senha,
        }, {
            body: {
                telefone,
                role
            }
        })

        if (authError) {
            setError("E-mail já cadastrado ou dados inválidos.")
            return
        }

        router.push("/verificar-email")
    };

    return (
        <main className="bg-background min-h-screen flex flex-col items-center p-2">

            <div className="flex flex-col items-center justify-center mt-10">
                <h1 className="text-3xl sm:text-5xl font-bold text-primary tracking-tight">
                    {title}
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                    {description}
                </p>
            </div>

            <section className="w-full max-w-md border border-border rounded-2xl p-8 bg-background mt-8 shadow">
                <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="nome" className="text-sm font-medium text-foreground">
                            Nome Completo
                        </label>
                        <input id="nome" type="text" placeholder="Seu nome completo" {...register('nome')} className="border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                        {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="telefone" className="text-sm font-medium text-foreground">
                            Telefone <span className="text-xs text-muted-foreground">(opcional)</span>
                        </label>
                        <input id="telefone" type="tel" placeholder="(00) 00000-0000" {...register('telefone')} className="border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                        {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone.message}</p>}
                    </div>
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
                        <input id="senha" type="password" placeholder="Minimo 8 caracteres" {...register('senha')} className="border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                        {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="confirmarSenha" className="text-sm font-medium text-foreground">
                            Confirmar Senha
                        </label>
                        <input id="confirmarSenha" type="password" placeholder="Repita a senha" {...register('confirmarSenha')} className="border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                        {errors.confirmarSenha && <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha.message}</p>}
                    </div>

                    <input type="hidden" id="role" value={role} {...register('role')} />

                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                        {error}
                        </p>
                    )}

                    <button type="submit" className="bg-primary p-2 font-semibold rounded-lg text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-4">
                        {isSubmitting ? "Criando..." : "Criar conta"}
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
                Já tem uma conta?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                    Entrar
                </Link>
            </p>
        </main>
    )
}