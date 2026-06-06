"use client"

import { useState } from "react"
import * as AlertDialog from "@radix-ui/react-alert-dialog"
import { deleteUser } from "@/lib/auth-client"

type DeleteAccountSectionProps = {
    onError: (message: string) => void
    onEmailSent: () => void
}

export default function DeleteAccountSection({ onError, onEmailSent }: DeleteAccountSectionProps) {
    const [confirmacaoTexto, setConfirmacaoTexto] = useState("")
    const [excluindo, setExcluindo] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

    async function handleExcluirConta() {
        if (confirmacaoTexto !== "CONFIRMAR") return
        setExcluindo(true)
        const { error: deleteError } = await deleteUser({ callbackURL: "/" })
        if (deleteError) {
            onError(deleteError.message || "Erro ao solicitar exclusão")
            setExcluindo(false)
            return
        }
        onEmailSent()
        setExcluindo(false)
        setModalOpen(false)
        setConfirmacaoTexto("")
    }

    return (
        <>
            <div className="flex flex-col gap-4 p-6 rounded-2xl border border-red-200 bg-red-50/50">
                <h2 className="text-sm font-semibold text-red-600 tracking-wide">Excluir conta</h2>
                <p className="text-sm text-red-600/80">
                    Sua conta e todos os dados associados serão excluídos permanentemente. Esta ação não pode ser desfeita.
                </p>

                <AlertDialog.Root open={modalOpen} onOpenChange={setModalOpen}>
                    <AlertDialog.Trigger asChild>
                        <button
                            type="button"
                            className="w-fit bg-red-600 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                            Excluir conta
                        </button>
                    </AlertDialog.Trigger>

                    <AlertDialog.Portal>
                        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50" />

                        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background p-4 sm:p-6 shadow-lg border-border border">
                            <AlertDialog.Title className="text-lg font-semibold text-foreground">
                                Excluir conta
                            </AlertDialog.Title>

                            <AlertDialog.Description className="text-sm text-muted-foreground mt-2">
                                Sua conta e todos os dados associados serão excluídos permanentemente. Esta ação não pode ser desfeita.
                            </AlertDialog.Description>

                            <div className="mt-4 flex flex-col gap-1">
                                <label className="text-sm font-medium text-red-600">
                                    Digite <strong>CONFIRMAR</strong> para prosseguir
                                </label>
                                <input
                                    type="text"
                                    value={confirmacaoTexto}
                                    onChange={(e) => setConfirmacaoTexto(e.target.value)}
                                    placeholder="CONFIRMAR"
                                    className="field-default"
                                />
                            </div>

                            <div className="mt-6 flex gap-2 justify-end">
                                <AlertDialog.Cancel
                                    onClick={() => setConfirmacaoTexto("")}
                                    className="border border-border rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                                >
                                    Cancelar
                                </AlertDialog.Cancel>
                                <button
                                    type="button"
                                    disabled={confirmacaoTexto !== "CONFIRMAR" || excluindo}
                                    onClick={handleExcluirConta}
                                    className="bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {excluindo ? "Excluindo..." : "Sim, excluir permanentemente"}
                                </button>
                            </div>
                        </AlertDialog.Content>
                    </AlertDialog.Portal>
                </AlertDialog.Root>
            </div>
        </>
    )
}
