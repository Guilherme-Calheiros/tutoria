"use client"

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaAngleLeft, FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import { FormCadastroSchema, schemaCadastro } from "@/schemas/cadastro";
import { useState } from "react";
import Link from "next/link";
import PasswordInput from "../components/PasswordInput";
import Mensagem from "../components/Mensagem";

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
    const [mensagem, setMensagem] = useState<{ type: "sucesso" | "erro"; text: string } | null>(null);
    const { title, description, role } = configCadastro[tipo];
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormCadastroSchema>({
        resolver: zodResolver(schemaCadastro)
    });

    const handleFormSubmit = async (data: FormCadastroSchema) => {
        setMensagem(null)
        const { nome, email, senha } = data

        const { error: authError } = await authClient.signUp.email({
            name: nome,
            email,
            password: senha,
        }, {
            body: {
                role
            }
        })

        if (authError) {
            setMensagem({ type: "erro", text: "E-mail já cadastrado ou dados inválidos." })
            return
        }

        router.push(`/verificar-email?email=${encodeURIComponent(email)}`)
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
                        {title}
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2">
                        {description}
                    </p>
                </div>
                <section className="w-full max-w-lg border border-border rounded-xl p-8 bg-background mt-8">
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="nome" className="text-sm font-medium text-foreground">
                                Nome Completo
                            </label>
                            <input id="nome" type="text" placeholder="Seu nome completo" aria-invalid={!!errors.nome} aria-describedby={errors.nome ? "erro-nome" : undefined} {...register('nome')} className="field-default" />
                            {errors.nome && <p id="erro-nome" role="alert" className="text-destructive text-sm mt-1">{errors.nome.message}</p>}
                        </div>
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
                            <PasswordInput id="senha" placeholder="Minimo 8 caracteres" aria-invalid={!!errors.senha} aria-describedby={errors.senha ? "erro-senha" : undefined} {...register('senha')} />
                            {errors.senha && <p id="erro-senha" role="alert" className="text-destructive text-sm mt-1">{errors.senha.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="confirmarSenha" className="text-sm font-medium text-foreground">
                                Confirmar Senha
                            </label>
                            <PasswordInput id="confirmarSenha" placeholder="Repita a senha" aria-invalid={!!errors.confirmarSenha} aria-describedby={errors.confirmarSenha ? "erro-confirmarSenha" : undefined} {...register('confirmarSenha')} />
                            {errors.confirmarSenha && <p id="erro-confirmarSenha" role="alert" className="text-destructive text-sm mt-1">{errors.confirmarSenha.message}</p>}
                        </div>
                        <input type="hidden" id="role" value={role} {...register('role')} />
                        <div className="flex items-start gap-2 mt-2">
                            <input
                                id="termosAceitos"
                                type="checkbox"
                                aria-invalid={!!errors.termosAceitos}
                                aria-describedby={errors.termosAceitos ? "erro-termos" : undefined}
                                {...register('termosAceitos')}
                                className="mt-1 size-4 accent-primary rounded border-border"
                            />
                            <label htmlFor="termosAceitos" className="text-sm text-muted-foreground leading-relaxed">
                                Aceito os{" "}
                                <Link href="/termos" target="_blank" className="text-primary underline hover:no-underline">
                                    Termos de Uso
                                </Link>{" "}
                                e a{" "}
                                <Link href="/privacidade" target="_blank" className="text-primary underline hover:no-underline">
                                    Política de Privacidade
                                </Link>
                            </label>
                        </div>
                        {errors.termosAceitos && <p id="erro-termos" role="alert" className="text-destructive text-sm mt-1">{errors.termosAceitos.message}</p>}
                        {mensagem && <Mensagem type={mensagem.type} message={mensagem.text} onClose={() => setMensagem(null)} />}
                        <button type="submit" disabled={isSubmitting} className="bg-primary p-2 min-h-11 font-semibold rounded-lg text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4 transition-colors">
                            {isSubmitting ? "Criando..." : "Criar conta"}
                        </button>
                
                        <div className="flex justify-center text-xs text-muted-foreground bg-background px-2">
                            ou
                        </div>
                        <button
                            type="button"
                            onClick={() => authClient.signIn.social({
                                provider: "google",
                                callbackURL: "/inicio",
                                ...(role === "tutor" && { newUserCallbackURL: "/api/auth/complete-tutor-signup" })
                            })}
                            className="flex items-center justify-center gap-2 min-h-11 border border-border rounded-lg px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
                        >
                            <FaGoogle />
                            Continuar com Google
                        </button>
                    </form>
                </section>
                <p className="mt-6 text-sm text-muted-foreground">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="text-primary font-medium hover:text-primary/80 transition-colors">
                        Entrar
                    </Link>
                </p>
            </section>
        </main>
    )
}