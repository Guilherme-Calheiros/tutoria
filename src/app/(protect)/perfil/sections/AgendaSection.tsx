"use client"

import Section from "@/app/components/Section"
import AgendaClient from "../AgendaClient"

type AgendaSectionProps = {
    disponibilidades: { diaDaSemana: number; startTime: string; endTime: string }[]
}

export default function AgendaSection({ disponibilidades }: AgendaSectionProps) {
    return (
        <Section titulo="Agenda de disponibilidade">
            <AgendaClient blocosSalvos={disponibilidades} />
        </Section>
    )
}
