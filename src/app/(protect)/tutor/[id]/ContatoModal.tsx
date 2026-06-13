"use client"

import { useEffect, useRef } from "react"
import { FaWhatsapp } from "react-icons/fa"
import { DIAS_EXTENSO } from "@/lib/schedule-utils"

type ContatoModalProps = {
    open: boolean
    tutorNome: string
    telefone: string
    diaDaSemana: number
    startTime: string
    endTime: string
    onClose: () => void
}

function formatarTelefoneWhatsApp(telefone: string): string {
    const digits = telefone.replace(/\D/g, "")
    return `55${digits}`
}

function gerarLinkWhatsApp(telefone: string, tutorNome: string, dia: string, inicio: string, fim: string): string {
    const numero = formatarTelefoneWhatsApp(telefone)
    const mensagem = `Olá ${tutorNome}! Vi que você está disponível ${dia} das ${inicio} às ${fim}. Gostaria de saber mais sobre suas aulas.`
    return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
}

export default function ContatoModal({ open, tutorNome, telefone, diaDaSemana, startTime, endTime, onClose }: ContatoModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        const el = dialogRef.current
        if (!el) return
        if (open) {
            el.showModal()
        } else {
            el.close()
        }
    }, [open])

    useEffect(() => {
        const el = dialogRef.current
        if (!el) return
        function handleClose() { onClose() }
        el.addEventListener("close", handleClose)
        return () => el.removeEventListener("close", handleClose)
    }, [onClose])

    if (!open) return null

    const dia = DIAS_EXTENSO[diaDaSemana]
    const whatsappLink = gerarLinkWhatsApp(telefone, tutorNome, dia, startTime, endTime)

    return (
        <dialog
            ref={dialogRef}
            className="fixed inset-0 z-50 m-auto w-full max-w-md rounded-2xl bg-surface border border-border shadow-xl p-0 backdrop:bg-black/50 open:flex open:flex-col"
            onClick={(e) => { if (e.target === dialogRef.current) onClose() }}
        >
            <div className="p-6 flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-foreground">
                    Entrar em contato
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed">
                    Deseja entrar em contato com <strong>{tutorNome}</strong> sobre o horário de{" "}
                    <strong>{dia} das {startTime} às {endTime}</strong>?
                </p>

                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 border border-border rounded-lg px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: "#25D366" }}
                    >
                        <FaWhatsapp className="w-4 h-4" />
                        WhatsApp
                    </a>
                </div>
            </div>
        </dialog>
    )
}
