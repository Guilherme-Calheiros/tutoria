"use client"

import { useState, useEffect } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { authClient } from "@/lib/auth-client";

type ResetPasswordDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    defaultEmail?: string
}

export default function ResetPasswordDialog({ open, onOpenChange, defaultEmail }: ResetPasswordDialogProps) {
    const [email, setEmail] = useState(defaultEmail || "");
    const [enviando, setEnviando] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!error) return;
        const t = setTimeout(() => setError(null), 5000);
        return () => clearTimeout(t);
    }, [error]);

    useEffect(() => {
        if (open) {
            setEmail(defaultEmail || "");
            setEnviado(false);
            setError(null);
        }
    }, [open, defaultEmail]);

    const handleSend = async () => {
        if (!email) return;
        setEnviando(true);
        setError(null);

        const { error: authError } = await authClient.requestPasswordReset({
            email,
            redirectTo: "/reset-password",
        });

        if (authError) {
            setError(authError.message ?? "Erro ao enviar email.");
            setEnviando(false);
            return;
        }

        setEnviado(true);
        setEnviando(false);
    };

    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50" />

                <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background p-4 sm:p-6 shadow-lg border-border border">
                    <AlertDialog.Title className="text-lg font-semibold text-foreground">
                        Redefinir senha
                    </AlertDialog.Title>

                    {enviado ? (
                        <AlertDialog.Description className="text-sm text-muted-foreground mt-2">
                            Se o email existir em nossa base, enviaremos um link para redefinir sua senha.
                        </AlertDialog.Description>
                    ) : (
                        <>
                            <AlertDialog.Description className="text-sm text-muted-foreground mt-2">
                                {email ? (
                                    <>Enviar link de redefinição para <strong>{email}</strong>?</>
                                ) : (
                                    "Digite seu email para receber o link de redefinição."
                                )}
                            </AlertDialog.Description>

                            {!email && (
                                <div className="mt-4 flex flex-col gap-1">
                                    <label htmlFor="resetEmail" className="text-sm font-medium text-foreground">
                                        Email
                                    </label>
                                    <input
                                        id="resetEmail"
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="field-default"
                                    />
                                </div>
                            )}

                            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                        </>
                    )}

                    <div className="mt-6 flex gap-2 justify-end">
                        <AlertDialog.Cancel
                            className="border border-border rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                            {enviado ? "Fechar" : "Cancelar"}
                        </AlertDialog.Cancel>

                        {!enviado && (
                            <button
                                type="button"
                                disabled={!email || enviando}
                                onClick={handleSend}
                                className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {enviando ? "Enviando..." : "Enviar link"}
                            </button>
                        )}
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    )
}
