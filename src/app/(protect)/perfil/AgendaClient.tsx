"use client"

import { salvarAgenda } from "@/action/salvarAgenda"
import { useState, useRef } from "react"

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

const GRADE_PARA_DB = [1, 2, 3, 4, 5, 6, 0]

const HORAS = Array.from({ length: 18 }, (_, i) => i + 6)

type BlocoDisponibilidade = {
    diaDaSemana: number,
    startTime: string,
    endTime: string
}

interface AgendaClientProps {
    blocosSalvos: BlocoDisponibilidade[]
}

function blocosParaCelulas(blocos: BlocoDisponibilidade[]): Set<string> {
    const celulas = new Set<string>()
    for (const bloco of blocos) {
        const gradeIdx = GRADE_PARA_DB.indexOf(bloco.diaDaSemana)
        if (gradeIdx === -1) continue
        const horaInicio = parseInt(bloco.startTime.split(":")[0])
        const horaFim = parseInt(bloco.endTime.split(":")[0])
        for (let h = horaInicio; h < horaFim; h++) {
            celulas.add(`${gradeIdx}-${h}`)
        }
    }
    return celulas
}

function celulasParaBlocos(celulas: Set<string>): BlocoDisponibilidade[] {
    const blocos: BlocoDisponibilidade[] = []
    
    for(let diaIndex = 0; diaIndex < 7; diaIndex++){
        const horasDia = HORAS.filter(hora => celulas.has(`${diaIndex}-${hora}`)).sort((a, b) => a - b)
        if (horasDia.length === 0) continue

        let inicioBloco = horasDia[0]
        let horaAnterior = horasDia[0]

        for(let i = 1; i <= horasDia.length; i++){
            const hora = horasDia[i]
            const consecutiva = hora === horaAnterior + 1

            if(!consecutiva) {
                blocos.push({
                    diaDaSemana: GRADE_PARA_DB[diaIndex],
                    startTime: `${String(inicioBloco).padStart(2, "0")}:00`,
                    endTime: `${String(horaAnterior + 1).padStart(2, "0")}:00`,
                })

                if (hora !== undefined) {
                    inicioBloco = hora
                    horaAnterior = hora
                }
            } else {
                horaAnterior = hora
            }
        }
    }

    return blocos
}

function formatarRange(celulas: Set<string>, diaIndex: number, horaInicio: number): string {
    let horaFim = horaInicio + 1
    while (celulas.has(`${diaIndex}-${horaFim}`)) {
        horaFim++
    }
    const inicio = `${String(horaInicio).padStart(2, "0")}:00`
    const fim = horaFim === 24 ? "23:59" : `${String(horaFim).padStart(2, "0")}:00`
    return `${inicio} – ${fim}`
}

function resumoTexto(celulas: Set<string>): string {
    if (celulas.size === 0) return "Nenhum horário selecionado"

    const blocos = celulasParaBlocos(celulas)
    let texto = `${celulas.size}h selecionada${celulas.size !== 1 ? "s" : ""}`

    if (blocos.length === 1) {
        const fim = blocos[0].endTime === "24:00" ? "23:59" : blocos[0].endTime
        texto += ` · ${blocos[0].startTime}–${fim}`
    } else if (blocos.length > 1) {
        texto += ` · ${blocos.length} blocos`
    }

    return texto
}

export default function AgendaClient({ blocosSalvos }: AgendaClientProps) {
    const [celulas, setCelulas] = useState<Set<string>>(
        () => blocosParaCelulas(blocosSalvos)
    )
    const [arrastando, setArrastando] = useState(false)
    const [modoArrasto, setModoArrasto] = useState<"marcar" | "desmarcar">("marcar")
    const [salvando, setSalvando] = useState(false)
    const [sucesso, setSucesso] = useState(false)
    const [erro, setErro] = useState<string | null>(null)
    const tableRef = useRef<HTMLTableElement>(null)
    const [focusedCell, setFocusedCell] = useState({ diaIndex: 0, hora: HORAS[0] })
 
    function handleMouseDown(key: string) {
        setArrastando(true)
        const novoModo = celulas.has(key) ? "desmarcar" : "marcar"
        setModoArrasto(novoModo)
        setCelulas(prev => {
            const next = new Set(prev)
            novoModo === "desmarcar" ? next.delete(key) : next.add(key)
            return next
        })
    }
 
    function handleMouseEnter(key: string) {
        if (!arrastando) return
        setCelulas(prev => {
            const next = new Set(prev)
            modoArrasto === "desmarcar" ? next.delete(key) : next.add(key)
            return next
        })
    }
 
    function handleMouseUp() {
        setArrastando(false)
    }

    function handleCellKeyDown(e: React.KeyboardEvent, diaIndex: number, hora: number) {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault()
            handleMouseDown(`${diaIndex}-${hora}`)
            return
        }

        let novoDia = diaIndex
        let novaHora = hora

        switch (e.key) {
            case "ArrowUp":
                novaHora = Math.max(HORAS[0], hora - 1)
                e.preventDefault()
                break
            case "ArrowDown":
                novaHora = Math.min(HORAS[HORAS.length - 1], hora + 1)
                e.preventDefault()
                break
            case "ArrowLeft":
                novoDia = Math.max(0, diaIndex - 1)
                e.preventDefault()
                break
            case "ArrowRight":
                novoDia = Math.min(6, diaIndex + 1)
                e.preventDefault()
                break
            default:
                return
        }

        const target = tableRef.current?.querySelector<HTMLElement>(
            `[data-cell-key="${novoDia}-${novaHora}"]`
        )
        target?.focus()
    }

    function limparTudo() {
        setCelulas(new Set())
    }
 
    async function handleSalvar() {
        setSalvando(true)
        setErro(null)
        setSucesso(false)
 
        const result = await salvarAgenda(celulasParaBlocos(celulas))
 
        setSalvando(false)
 
        if (result.error) {
            setErro(result.error)
            return
        }
 
        setSucesso(true)
        setTimeout(() => setSucesso(false), 3000)
    }
 
    return (
        <div className="w-full select-none" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <p className="text-xs text-muted-foreground">
                    Clique ou arraste para marcar seus horários disponíveis.
                </p>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={limparTudo}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Limpar tudo
                    </button>
                    <button
                        type="button"
                        onClick={handleSalvar}
                        disabled={salvando}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {salvando ? "Salvando..." : "Salvar agenda"}
                    </button>
                </div>
            </div>
 
            {sucesso && (
                <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-4">
                    Agenda salva com sucesso!
                </p>
            )}
 
            {erro && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-4">
                    {erro}
                </p>
            )}
 
            <div className="overflow-x-auto rounded-xl border border-border">
                <table ref={tableRef} role="grid" aria-label="Grade de horários disponíveis" className="w-full min-w-[640px] table-fixed border-collapse">
                    <thead>
                        <tr role="row">
                            <th scope="col" role="columnheader" className="w-14 bg-muted border-b border-r border-border" />
                            {DIAS.map((dia, i) => (
                                <th
                                    key={i}
                                    scope="col"
                                    role="columnheader"
                                    className="bg-muted border-b border-r border-border py-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center last:border-r-0"
                                >
                                    {dia}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {HORAS.map((hora) => (
                            <tr key={hora} role="row" className="group">
                                <th scope="row" role="rowheader" className="bg-muted border-b border-r border-border py-2 px-3 text-xs text-muted-foreground text-right font-medium align-middle">
                                    {String(hora).padStart(2, "0")}h
                                </th>
                                {DIAS.map((_, diaIndex) => {
                                    const key = `${diaIndex}-${hora}`
                                    const ativa = celulas.has(key)
                                    const temAcima = celulas.has(`${diaIndex}-${hora - 1}`)
 
                                    return (
                                        <td
                                            key={diaIndex}
                                            role="gridcell"
                                            tabIndex={
                                                focusedCell.diaIndex === diaIndex && focusedCell.hora === hora
                                                    ? 0
                                                    : -1
                                            }
                                            aria-selected={ativa}
                                            aria-label={`${DIAS[diaIndex]} ${String(hora).padStart(2, "0")}:00${ativa ? ", disponível" : ""}`}
                                            data-cell-key={key}
                                            className={`
                                                border-b border-r border-border min-h-11 sm:h-10 cursor-pointer transition-colors last:border-r-0
                                                ${ativa
                                                    ? "bg-primary/85 hover:bg-primary"
                                                    : "bg-background hover:bg-secondary"
                                                }
                                                focus-visible:outline-2 focus-visible:outline-primary focus-visible:-outline-offset-2 focus-visible:relative
                                            `}
                                            onMouseDown={() => handleMouseDown(key)}
                                            onMouseEnter={() => handleMouseEnter(key)}
                                            onFocus={() => setFocusedCell({ diaIndex, hora })}
                                            onKeyDown={(e) => handleCellKeyDown(e, diaIndex, hora)}
                                        >

                                            {ativa && !temAcima && (
                                                <div className="hidden sm:block px-2 pt-1.5">
                                                    <span className="text-xs text-primary-foreground font-medium leading-none">
                                                        {formatarRange(celulas, diaIndex, hora)}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
 
            <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary" />
                    <span className="text-xs text-muted-foreground">Disponível</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted border border-border" />
                    <span className="text-xs text-muted-foreground">Indisponível</span>
                </div>
                <span className="text-xs text-muted-foreground ml-2">
                    {resumoTexto(celulas)}
                </span>
            </div>
        </div>
    )
}