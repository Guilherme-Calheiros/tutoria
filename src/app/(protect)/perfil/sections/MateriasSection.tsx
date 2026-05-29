"use client"

import { useState } from "react"
import { FaPencilAlt } from "react-icons/fa"
import { salvarPerfil } from "@/action/salvarPerfil"
import Section from "@/app/components/Section"
import TagSelector from "@/app/components/TagSelector"

type Materia = { id: number; nome: string }

type MateriasSectionProps = {
    userId: string
    materiasIds: number[]
    todasMaterias: Materia[]
}

export default function MateriasSection({ userId, materiasIds, todasMaterias }: MateriasSectionProps) {
    const [editando, setEditando] = useState(false)
    const [hover, setHover] = useState(false)
    const [selectedIds, setSelectedIds] = useState<number[]>(materiasIds)
    const [error, setError] = useState<string | null>(null)

    function toggleMateria(id: number) {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        )
    }

    async function handleSave() {
        setError(null)
        const result = await salvarPerfil(userId, { materias: selectedIds })
        if (result?.validationErrors) {
            setError(result.validationErrors.map(e => e.message).join(". "))
            return
        }
        if (result?.error) {
            setError(result.error)
            return
        }
        setEditando(false)
        window.dispatchEvent(new CustomEvent("refreshNotificacoes"))
    }

    function handleCancel() {
        setSelectedIds(materiasIds)
        setEditando(false)
        setError(null)
    }

    if (!editando) {
        return (
            <Section
                titulo="Matérias"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                action={
                    hover && (
                        <button
                            type="button"
                            onClick={() => setEditando(true)}
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <FaPencilAlt className="w-3.5 h-3.5" />
                        </button>
                    )
                }
            >
                <div className="flex flex-wrap gap-2">
                    {todasMaterias
                        .filter((m) => materiasIds.includes(m.id))
                        .map((m) => (
                            <span key={m.id} className="text-sm bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                                {m.nome}
                            </span>
                        ))}
                    {materiasIds.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma matéria cadastrada</p>}
                </div>
            </Section>
        )
    }

    return (
        <Section titulo="Matérias">
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <TagSelector
                items={todasMaterias}
                selectedIds={selectedIds}
                onToggle={toggleMateria}
            />
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={selectedIds.length === 0 || selectedIds.sort().toString() === materiasIds.sort().toString()}
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
