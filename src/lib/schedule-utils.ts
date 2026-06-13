export const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const

export const DIAS_EXTENSO = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"] as const

export const GRADE_PARA_DB = [1, 2, 3, 4, 5, 6, 0] as const

export const HORAS = Array.from({ length: 18 }, (_, i) => i + 6)

export const LINHAS_GRID: number[][] = (() => {
    const linhas: number[][] = []
    for (let i = 0; i < HORAS.length; i += 6) {
        linhas.push(HORAS.slice(i, i + 6))
    }
    return linhas
})()

export type BlocoDisponibilidade = {
    diaDaSemana: number
    startTime: string
    endTime: string
}

export function blocosParaCelulas(blocos: BlocoDisponibilidade[]): Set<string> {
    const celulas = new Set<string>()
    for (const bloco of blocos) {
        const gradeIdx = GRADE_PARA_DB.indexOf(bloco.diaDaSemana as (typeof GRADE_PARA_DB)[number])
        if (gradeIdx === -1) continue
        const horaInicio = parseInt(bloco.startTime.split(":")[0])
        const horaFim = parseInt(bloco.endTime.split(":")[0])
        for (let h = horaInicio; h < horaFim; h++) {
            celulas.add(`${gradeIdx}-${h}`)
        }
    }
    return celulas
}

export function celulasParaBlocos(celulas: Set<string>): BlocoDisponibilidade[] {
    const blocos: BlocoDisponibilidade[] = []

    for (let diaIndex = 0; diaIndex < 7; diaIndex++) {
        const horasDia = HORAS.filter(hora => celulas.has(`${diaIndex}-${hora}`)).sort((a, b) => a - b)
        if (horasDia.length === 0) continue

        let inicioBloco = horasDia[0]
        let horaAnterior = horasDia[0]

        for (let i = 1; i <= horasDia.length; i++) {
            const hora = horasDia[i]
            const consecutiva = hora === horaAnterior + 1

            if (!consecutiva) {
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

export function rangesDoDia(celulas: Set<string>, diaIndex: number): { inicio: number; fim: number }[] {
    const ranges: { inicio: number; fim: number }[] = []
    let i = 0
    while (i < HORAS.length) {
        const hora = HORAS[i]
        if (celulas.has(`${diaIndex}-${hora}`)) {
            const inicio = hora
            while (i < HORAS.length && celulas.has(`${diaIndex}-${HORAS[i]}`)) {
                i++
            }
            ranges.push({ inicio, fim: HORAS[i - 1] + 1 })
        } else {
            i++
        }
    }
    return ranges
}

export function horasNoDia(celulas: Set<string>, diaIndex: number): number {
    return HORAS.filter(h => celulas.has(`${diaIndex}-${h}`)).length
}
