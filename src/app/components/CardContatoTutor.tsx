"use client"

import { FaWhatsapp } from "react-icons/fa"

type CardContatoTutorProps = {
    whatsappLink: string
    modalidade: string
    ensinaPrivado: boolean
    ensinaTurma: boolean
    voluntario: boolean
    valorHora: string | null
    enderecoHeader: string | null
    materias: { id: number; nome: string }[]
}

export function formatarModalidade(valor: string): string {
    if (valor === "ead") return "EAD"
    if (valor === "presencial") return "Presencial"
    return "Presencial e EAD"
}

export function formatarAtendimento(privado: boolean, turma: boolean): string {
    return [privado && "Particular", turma && "Turma"].filter(Boolean).join(" e ") || "Não informado"
}

export default function CardContatoTutor({
    whatsappLink,
    modalidade,
    ensinaPrivado,
    ensinaTurma,
    voluntario,
    valorHora,
    enderecoHeader,
    materias,
}: CardContatoTutorProps) {
    return (
        <div className="border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border bg-muted/20">
                <p className="text-xs text-muted-foreground mb-0.5">Valor por hora</p>
                <p className="text-2xl font-bold text-foreground">
                    {voluntario ? "Voluntário" : valorHora ? `R$ ${valorHora}` : "A combinar"}
                </p>
                {valorHora && !voluntario && (
                    <p className="text-xs text-muted-foreground">por hora</p>
                )}
            </div>

            <div className="p-5 flex flex-col gap-3 border-b border-border">
                <div className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground w-24 shrink-0">Modalidade</span>
                    <span className="font-medium text-foreground">{formatarModalidade(modalidade)}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground w-24 shrink-0">Atendimento</span>
                    <span className="font-medium text-foreground">{formatarAtendimento(ensinaPrivado, ensinaTurma)}</span>
                </div>
                {enderecoHeader && (
                    <div className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground w-24 shrink-0">Local</span>
                        <span className="font-medium text-foreground">{enderecoHeader}</span>
                    </div>
                )}
                {materias.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground w-24 shrink-0">Matérias</span>
                        <span className="font-medium text-foreground">{materias.map(m => m.nome).join(", ")}</span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white hover:opacity-90 active:scale-[0.98] transition-all w-full"
                    style={{ backgroundColor: "#25D366" }}
                >
                    <FaWhatsapp className="w-4 h-4" />
                    Entrar em contato
                </a>
            </div>
        </div>
    )
}
