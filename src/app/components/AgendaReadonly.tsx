"use client"

import { useState, useMemo } from "react"
import { FaAngleLeft, FaAngleRight, FaRegClock } from "react-icons/fa"
import { DIAS, LINHAS_GRID, BlocoDisponibilidade, blocosParaCelulas, rangesDoDia, horasNoDia } from "@/lib/schedule-utils"

type AgendaReadonlyProps = {
    disponibilidades: BlocoDisponibilidade[]
    onClickHora: (dia: number, inicio: string, fim: string) => void
}

export default function AgendaReadonly({ disponibilidades, onClickHora }: AgendaReadonlyProps) {
    const [diaMobile, setDiaMobile] = useState(0)

    const celulas = useMemo(() => blocosParaCelulas(disponibilidades), [disponibilidades])
    const temDisponibilidade = disponibilidades.length > 0
    const ranges = useMemo(() => rangesDoDia(celulas, diaMobile), [celulas, diaMobile])
    const horas = useMemo(() => horasNoDia(celulas, diaMobile), [celulas, diaMobile])

    if (!temDisponibilidade) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                <FaRegClock className="w-4 h-4" />
                <span>Nenhum horário disponível cadastrado</span>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={() => setDiaMobile(Math.max(0, diaMobile - 1))}
                    disabled={diaMobile === 0}
                    className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-20"
                    aria-label="Dia anterior"
                >
                    <FaAngleLeft className="w-4 h-4" />
                </button>
                <span className="text-lg font-bold text-foreground">{DIAS[diaMobile]}</span>
                <button
                    type="button"
                    onClick={() => setDiaMobile(Math.min(6, diaMobile + 1))}
                    disabled={diaMobile === 6}
                    className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-20"
                    aria-label="Próximo dia"
                >
                    <FaAngleRight className="w-4 h-4" />
                </button>
            </div>

            <div className="bg-muted/30 rounded-2xl p-4">
                <div className="flex flex-col gap-2">
                    {LINHAS_GRID.map((linha, i) => (
                        <div key={i} className="flex gap-2 justify-center">
                            {linha.map(hora => {
                                const key = `${diaMobile}-${hora}`
                                const selecionado = celulas.has(key)
                                return (
                                    <div
                                        key={hora}
                                        className={`flex-1 rounded-lg px-1 py-2 text-center text-xs font-semibold tabular-nums transition-all duration-100 ${
                                            selecionado
                                                ? "bg-primary text-primary-foreground shadow-sm cursor-pointer hover:brightness-110"
                                                : "bg-background text-muted-foreground/60"
                                        }`}
                                        onClick={() => {
                                            if (selecionado) {
                                                onClickHora(
                                                    diaMobile,
                                                    `${String(hora).padStart(2, "0")}:00`,
                                                    `${String(hora + 1).padStart(2, "0")}:00`
                                                )
                                            }
                                        }}
                                        role={selecionado ? "button" : undefined}
                                        tabIndex={selecionado ? 0 : undefined}
                                        onKeyDown={(e) => {
                                            if (selecionado && (e.key === "Enter" || e.key === " ")) {
                                                e.preventDefault()
                                                onClickHora(
                                                    diaMobile,
                                                    `${String(hora).padStart(2, "0")}:00`,
                                                    `${String(hora + 1).padStart(2, "0")}:00`
                                                )
                                            }
                                        }}
                                    >
                                        {String(hora).padStart(2, "0")}:00
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-4 mb-3">
                {DIAS.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setDiaMobile(i)}
                        className={`cursor-pointer rounded-full transition-all duration-300 ${
                            i === diaMobile
                                ? "w-7 h-2 bg-primary"
                                : "w-2.5 h-2.5 bg-muted-foreground/60 hover:bg-muted-foreground/80"
                        }`}
                        aria-label={`Ir para ${DIAS[i]}`}
                    />
                ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
                {horas > 0 ? (
                    <>
                        <div className="flex items-center gap-1.5">
                            <span className="text-base font-bold text-foreground tabular-nums">{horas}h</span>
                            <span className="text-sm text-muted-foreground">disponíve{horas !== 1 ? "is" : "l"}</span>
                        </div>
                        <span className="text-muted-foreground/30 hidden sm:inline">|</span>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            {ranges.map((r, i) => (
                                <span key={i} className="inline-flex items-center gap-1 bg-secondary text-muted-foreground px-2.5 py-0.5 rounded-md text-xs font-medium tabular-nums">
                                    <span className="w-2 h-2 rounded-full bg-primary/60" />
                                    {String(r.inicio).padStart(2, "0")}:00 &ndash; {String(r.fim).padStart(2, "0")}:00
                                </span>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FaRegClock className="w-4 h-4" />
                        <span>Nenhum horário disponível neste dia</span>
                    </div>
                )}
            </div>
        </div>
    )
}
