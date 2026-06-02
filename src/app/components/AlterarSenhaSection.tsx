"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { verificarTemSenha, criarSenha } from "@/action/acaoSenha";
import { FormAlterarSenhaSchema, schemaAlterarSenha } from "@/schemas/alterar-senha";
import { FormResetarSenhaSchema, schemaResetarSenha } from "@/schemas/resetar-senha";
import PasswordInput from "./PasswordInput";

export default function AlterarSenhaSection() {
    const [temSenha, setTemSenha] = useState<boolean | null>(null);
    const [sucesso, setSucesso] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!error && !sucesso) return;
        const t = setTimeout(() => { setError(null); setSucesso(false); }, 5000);
        return () => clearTimeout(t);
    }, [error, sucesso]);

    const formAlterar = useForm<FormAlterarSenhaSchema>({
        resolver: zodResolver(schemaAlterarSenha)
    });

    const formCriar = useForm<FormResetarSenhaSchema>({
        resolver: zodResolver(schemaResetarSenha)
    });

    useEffect(() => {
        verificarTemSenha().then((res) => setTemSenha(res.temSenha));
    }, []);

    const handleChangePassword = async (data: FormAlterarSenhaSchema) => {
        setError(null);
        setSucesso(false);

        const { error: authError } = await authClient.changePassword({
            currentPassword: data.senhaAtual,
            newPassword: data.novaSenha,
            revokeOtherSessions: true,
        });

        if (authError) {
            setError(authError.message ?? "Ocorreu um erro ao alterar a senha.");
            return;
        }

        setSucesso(true);
        formAlterar.reset();
    };

    const handleCreatePassword = async (data: FormResetarSenhaSchema) => {
        setError(null);
        setSucesso(false);

        const res = await criarSenha(data.novaSenha);

        if (!res.success) {
            setError(res.error ?? "Ocorreu um erro ao criar a senha.");
            return;
        }

        setSucesso(true);
        setTemSenha(true);
        formCriar.reset();
    };

    if (temSenha === null) {
        return <p className="text-sm text-muted-foreground">Carregando...</p>
    }

    if (!temSenha) {
        return (
            <form onSubmit={formCriar.handleSubmit(handleCreatePassword)} className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                    Você entrou com Google. Crie uma senha para acessar também por email.
                </p>
                <div className="flex flex-col gap-1">
                    <label htmlFor="novaSenha" className="text-sm font-medium text-foreground">
                        Nova senha
                    </label>
                    <PasswordInput id="novaSenha" placeholder="Mínimo 8 caracteres" {...formCriar.register("novaSenha")} />
                    {formCriar.formState.errors.novaSenha && <p className="text-red-500 text-sm mt-1">{formCriar.formState.errors.novaSenha.message}</p>}
                </div>

                {error && (
                    <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                        {error}
                    </p>
                )}

                {sucesso && (
                    <p className="text-sm text-green-500 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                        Senha criada com sucesso!
                    </p>
                )}

                <button type="submit" disabled={formCriar.formState.isSubmitting} className="bg-primary p-2 font-semibold rounded-lg text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    {formCriar.formState.isSubmitting ? "Criando..." : "Criar senha"}
                </button>
            </form>
        )
    }

    return (
        <form onSubmit={formAlterar.handleSubmit(handleChangePassword)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <label htmlFor="senhaAtual" className="text-sm font-medium text-foreground">
                    Senha atual
                </label>
                <PasswordInput id="senhaAtual" placeholder="Sua senha atual" {...formAlterar.register("senhaAtual")} />
                {formAlterar.formState.errors.senhaAtual && <p className="text-red-500 text-sm mt-1">{formAlterar.formState.errors.senhaAtual.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="novaSenha" className="text-sm font-medium text-foreground">
                    Nova senha
                </label>
                <PasswordInput id="novaSenha" placeholder="Mínimo 8 caracteres" {...formAlterar.register("novaSenha")} />
                {formAlterar.formState.errors.novaSenha && <p className="text-red-500 text-sm mt-1">{formAlterar.formState.errors.novaSenha.message}</p>}
            </div>

            {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                    {error}
                </p>
            )}

            {sucesso && (
                <p className="text-sm text-green-500 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                    Senha alterada com sucesso!
                </p>
            )}

            <button type="submit" disabled={formAlterar.formState.isSubmitting} className="bg-primary p-2 font-semibold rounded-lg text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2">
                {formAlterar.formState.isSubmitting ? "Alterando..." : "Alterar senha"}
            </button>
        </form>
    )
}
