"use client"

import { salvarAgenda } from "@/action/salvarAgenda"
import { useState, useRef, useMemo } from "react"
import { FaAngleLeft, FaAngleRight, FaRegClock } from "react-icons/fa"
import Mensagem from "@/app/components/Mensagem"
import { DIAS, LINHAS_GRID, BlocoDisponibilidade, blocosParaCelulas, celulasParaBlocos, rangesDoDia, horasNoDia } from "@/lib/schedule-utils"

interface AgendaClientProps {
    blocosSalvos: BlocoDisponibilidade[]
}

export default function AgendaClient({ blocosSalvos }: AgendaClientProps) {
    const [celulas, setCelulas] = useState<Set<string>>(
        () => blocosParaCelulas(blocosSalvos)
    )
    const [arrastando, setArrastando] = useState(false)
    const [modoArrasto, setModoArrasto] = useState<"marcar" | "desmarcar">("marcar")
    const [salvando, setSalvando] = useState(false)
    const [mensagem, setMensagem] = useState<{ type: "sucesso" | "erro"; text: string } | null>(null)
    const [diaMobile, setDiaMobile] = useState(0)
    const touchRef = useRef({ startX: 0 })

    function handleTouchStart(e: React.TouchEvent) {
        touchRef.current.startX = e.touches[0].clientX
    }

    function handleTouchEnd(e: React.TouchEvent) {
        const diff = e.changedTouches[0].clientX - touchRef.current.startX
        if (Math.abs(diff) > 50) {
            setDiaMobile(prev => diff > 0 ? Math.max(0, prev - 1) : Math.min(6, prev + 1))
        }
    }

    const ranges = useMemo(() => rangesDoDia(celulas, diaMobile), [celulas, diaMobile])
    const horas = useMemo(() => horasNoDia(celulas, diaMobile), [celulas, diaMobile])

    function toggleCelula(key: string) {
        setCelulas(prev => {
            const next = new Set(prev)
            next.has(key) ? next.delete(key) : next.add(key)
            return next
        })
    }

    function handleMouseDown(key: string) {
        const novoModo = celulas.has(key) ? "desmarcar" : "marcar"
        setArrastando(true)
        setModoArrasto(novoModo)
        toggleCelula(key)
    }
 
    function handleMouseEnter(key: string) {
        if (!arrastando) return
        setCelulas(prev => {
            const next = new Set(prev)
            const tem = next.has(key)
            if (modoArrasto === "marcar" && !tem) next.add(key)
            if (modoArrasto === "desmarcar" && tem) next.delete(key)
            return next
        })
    }
 
    function handleMouseUp() {
        setArrastando(false)
    }

    function limparHorariosDia() {
        setCelulas(prev => new Set([...prev].filter(key => !key.startsWith(`${diaMobile}-`))))
    }
 
    async function handleSalvar() {
        setSalvando(true)
        setMensagem(null)
        const result = await salvarAgenda(celulasParaBlocos(celulas))
  
        setSalvando(false)
  
        const validationErrors = (result as any).validationErrors
        if (validationErrors) {
            setMensagem({ type: "erro", text: validationErrors.map((e: { message: string }) => e.message).join(". ") })
            return
        }
        if (result.error) {
            setMensagem({ type: "erro", text: result.error })
            return
        }
    }

    return (
        <div
            className="w-full select-none"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={() => setDiaMobile(Math.max(0, diaMobile - 1))}
                    disabled={diaMobile === 0}
                    className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                    aria-label="Dia anterior"
                >
                    <FaAngleLeft />
                </button>
                <span className="text-base sm:text-lg font-bold text-foreground">
                    {DIAS[diaMobile]}
                </span>
                <button
                    type="button"
                    onClick={() => setDiaMobile(Math.min(6, diaMobile + 1))}
                    disabled={diaMobile === 6}
                    className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                    aria-label="Próximo dia"
                >
                    <FaAngleRight />
                </button>
            </div>

            <div className="bg-muted/30 rounded-2xl p-2.5 sm:p-3">
                <div className="flex flex-col gap-1.5">
                    {LINHAS_GRID.map((linha, i) => (
                        <div key={i} className="flex gap-1.5 sm:gap-2 justify-center">
                            {linha.map(hora => {
                                const key = `${diaMobile}-${hora}`
                                const selecionado = celulas.has(key)
                                return (
                                    <div
                                        key={hora}
                                        data-cell-key={key}
                                        className={`
                                            flex-1 rounded-xl px-1.5 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-semibold tabular-nums
                                            transition-all duration-100 cursor-pointer
                                            ${selecionado
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "bg-background text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted"
                                            }
                                        `}
                                        onMouseDown={() => handleMouseDown(key)}
                                        onMouseEnter={() => handleMouseEnter(key)}
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
                                ? "w-6 h-1.5 bg-primary"
                                : "w-2 h-2 bg-muted-foreground/60 hover:bg-muted-foreground/80"
                        }`}
                        aria-label={`Ir para ${DIAS[i]}`}
                    />
                ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mb-4">
                {horas > 0 ? (
                    <>
                        <div className="flex items-center gap-1.5">
                            <span className="text-base font-bold text-foreground tabular-nums">{horas}h</span>
                            <span className="text-xs text-muted-foreground">disponíve{horas !== 1 ? "is" : "l"}</span>
                        </div>
                        <span className="hidden sm:inline text-muted-foreground/30">·</span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            {ranges.map((r, i) => (
                                <span key={i} className="inline-flex items-center gap-1 bg-secondary text-muted-foreground px-2 py-0.5 rounded-md font-medium tabular-nums">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                                    {String(r.inicio).padStart(2, "0")}:00–{String(r.fim).padStart(2, "0")}:00
                                </span>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FaRegClock />
                        <span>Nenhum horário definido</span>
                    </div>
                )}
            </div>

            {mensagem && <Mensagem type={mensagem.type} message={mensagem.text} onClose={() => setMensagem(null)} className="mb-4" />}

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-primary" />
                        <span className="text-xs text-muted-foreground">Disponível</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-muted border border-border" />
                        <span className="text-xs text-muted-foreground">Indisponível</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={limparHorariosDia}
                        className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Limpar
                    </button>
                    <button
                        type="button"
                        onClick={handleSalvar}
                        disabled={salvando}
                        className="cursor-pointer bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {salvando ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </div>
        </div>
    )
}
