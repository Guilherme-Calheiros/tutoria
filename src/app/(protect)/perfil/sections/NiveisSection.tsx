"use client"

import { useState } from "react"
import { FaPencilAlt } from "react-icons/fa"
import { salvarPerfil } from "@/action/salvarPerfil"
import Section from "@/app/components/Section"
import TagSelector from "@/app/components/TagSelector"
import Mensagem from "@/app/components/Mensagem"

type NivelEnsino = { id: number; nome: string }

type NiveisSectionProps = {
    userId: string
    niveisIds: number[]
    todosNiveis: NivelEnsino[]
}

export default function NiveisSection({ userId, niveisIds, todosNiveis }: NiveisSectionProps) {
    const [editando, setEditando] = useState(false)
    const [selectedIds, setSelectedIds] = useState<number[]>(niveisIds)
    const [mensagem, setMensagem] = useState<{ type: "sucesso" | "erro"; text: string } | null>(null)

    function toggleNivel(id: number) {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
        )
    }

    async function handleSave() {
        setMensagem(null)
        const result = await salvarPerfil(userId, { niveisEnsino: selectedIds })
        if (result?.validationErrors) {
            setMensagem({ type: "erro", text: result.validationErrors.map(e => e.message).join(". ") })
            return
        }
        if (result?.error) {
            setMensagem({ type: "erro", text: result.error })
            return
        }
        setEditando(false)
        setMensagem({ type: "sucesso", text: "Níveis salvos com sucesso" })
        window.dispatchEvent(new CustomEvent("refreshNotificacoes"))
    }

    function handleCancel() {
        setSelectedIds(niveisIds)
        setEditando(false)
        setMensagem(null)
    }

    if (!editando) {
        return (
            <Section
                titulo="Níveis de ensino"
                action={
                    <button
                        type="button"
                        onClick={() => setEditando(true)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Editar Níveis de ensino"
                    >
                        <FaPencilAlt className="w-3.5 h-3.5" />
                    </button>
                }
            >
                {mensagem && <Mensagem type={mensagem.type} message={mensagem.text} onClose={() => setMensagem(null)} duration={4000} />}
                <div className="flex flex-wrap gap-2">
                    {todosNiveis
                        .filter((n) => niveisIds.includes(n.id))
                        .map((n) => (
                            <span key={n.id} className="text-sm bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                                {n.nome}
                            </span>
                        ))}
                    {niveisIds.length === 0 && <p className="text-sm text-muted-foreground">Nenhum nível cadastrado</p>}
                </div>
            </Section>
        )
    }

    return (
        <Section titulo="Níveis de ensino">
            {mensagem && <Mensagem type={mensagem.type} message={mensagem.text} onClose={() => setMensagem(null)} className="mb-2" duration={4000} />}
            <TagSelector
                items={todosNiveis}
                selectedIds={selectedIds}
                onToggle={toggleNivel}
            />
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={selectedIds.length === 0 || selectedIds.sort().toString() === niveisIds.sort().toString()}
                    className="bg-primary text-primary-foreground rounded-lg px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    Salvar
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="border border-border rounded-lg px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                    Cancelar
                </button>
            </div>
        </Section>
    )
}
