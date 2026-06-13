"use client"

import { useState, useMemo } from "react"
import { FaMapMarkerAlt, FaGraduationCap, FaBookOpen } from "react-icons/fa"
import UserAvatar from "@/app/components/UserAvatar"
import CardContatoTutor, { formatarModalidade } from "@/app/components/CardContatoTutor"
import AgendaReadonly from "@/app/components/AgendaReadonly"
import ContatoModal from "./ContatoModal"
import { BlocoDisponibilidade } from "@/lib/schedule-utils"

type TutorProfileClientProps = {
    userId: string
    nome: string
    image: string | null
    telefone: string | null
    descricao: string | null
    modalidade: string
    ensinaPrivado: boolean
    ensinaTurma: boolean
    valorHora: string | null
    voluntario: boolean
    materias: { id: number; nome: string }[]
    niveis: { id: number; nome: string }[]
    enderecos: { bairro: string; cidade: string; estado: string }[]
    disponibilidades: BlocoDisponibilidade[]
}

function formatarPreco(voluntario: boolean, valorHora: string | null): string {
    if (voluntario) return "Voluntário"
    if (valorHora) return `R$ ${valorHora}/h`
    return "A combinar"
}

function formatarTelefoneWhatsApp(telefone: string): string {
    const digits = telefone.replace(/\D/g, "")
    return `55${digits}`
}

export default function TutorProfileClient(props: TutorProfileClientProps) {
    const {
        nome, image, telefone, descricao, modalidade,
        ensinaPrivado, ensinaTurma, voluntario, valorHora,
        materias, niveis, enderecos, disponibilidades,
    } = props

    const [modalOpen, setModalOpen] = useState(false)
    const [modalDia, setModalDia] = useState(0)
    const [modalInicio, setModalInicio] = useState("")
    const [modalFim, setModalFim] = useState("")

    const whatsappNumber = telefone ? formatarTelefoneWhatsApp(telefone) : null
    const whatsappLink = whatsappNumber
        ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá! Gostaria de saber mais sobre suas aulas de tutoria.")}`
        : null

    const enderecoHeader = useMemo(() => {
        if (enderecos.length === 0) return null
        const cidades = [...new Set(enderecos.map(e => `${e.cidade}, ${e.estado}`))]
        return cidades.join(" e ")
    }, [enderecos])

    function abrirModal(dia: number, inicio: string, fim: string) {
        setModalDia(dia)
        setModalInicio(inicio)
        setModalFim(fim)
        setModalOpen(true)
    }

    return (
        <div className="w-full max-w-5xl mx-auto mt-8 px-4 sm:px-6 py-4 space-y-6">

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">
                <div className="border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <UserAvatar name={nome} src={image} size="lg" />
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{nome}</h1>
                            <p className="text-xs text-muted-foreground capitalize mt-0.5">Tutor</p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                    modalidade === "ead"
                                        ? "bg-primary/10 text-primary"
                                        : modalidade === "presencial"
                                            ? "bg-accent/10 text-accent"
                                            : "bg-secondary text-secondary-foreground"
                                }`}>
                                    {formatarModalidade(modalidade)}
                                </span>
                                <span className="text-[11px] font-semibold text-muted-foreground bg-background border border-border px-2 py-0.5 rounded-full">
                                    {formatarPreco(voluntario, valorHora)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {descricao && (
                        <>
                            <hr className="border-border" />
                            <div>
                                <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Sobre</h2>
                                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{descricao}</p>
                            </div>
                        </>
                    )}

                    <hr className="border-border" />
                    <div>
                        <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Matérias</h2>
                        <div className="flex flex-wrap gap-1.5">
                            {materias.map((m) => (
                                <span
                                    key={m.id}
                                    className="inline-flex items-center gap-1 text-xs font-medium bg-background text-foreground px-2.5 py-1 rounded-full border border-border"
                                >
                                    <FaBookOpen className="w-3 h-3 text-muted-foreground shrink-0" />
                                    {m.nome}
                                </span>
                            ))}
                        </div>
                    </div>

                    <hr className="border-border" />
                    <div>
                        <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Níveis de ensino</h2>
                        <div className="flex flex-wrap gap-1.5">
                            {niveis.map((n) => (
                                <span
                                    key={n.id}
                                    className="inline-flex items-center gap-1 text-xs font-medium bg-background text-foreground px-2.5 py-1 rounded-full border border-border"
                                >
                                    <FaGraduationCap className="w-3 h-3 text-muted-foreground shrink-0" />
                                    {n.nome}
                                </span>
                            ))}
                        </div>
                    </div>

                    {enderecos.length > 0 && (
                        <>
                            <hr className="border-border" />
                            <div>
                                <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Locais de atendimento</h2>
                                <div className="flex flex-col gap-1.5">
                                    {enderecos.map((e, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                                            <FaMapMarkerAlt className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                            <span>{e.bairro}, {e.cidade} &mdash; {e.estado}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {telefone && (
                        <>
                            <hr className="border-border" />
                            <div>
                                <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Agenda</h2>
                                <p className="text-xs text-muted-foreground mb-3">Clique em um horário disponível para entrar em contato</p>
                                <AgendaReadonly
                                    disponibilidades={disponibilidades}
                                    onClickHora={abrirModal}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    {whatsappLink && (
                        <div className="lg:sticky lg:top-24">
                            <CardContatoTutor
                                whatsappLink={whatsappLink}
                                modalidade={modalidade}
                                ensinaPrivado={ensinaPrivado}
                                ensinaTurma={ensinaTurma}
                                voluntario={voluntario}
                                valorHora={valorHora}
                                enderecoHeader={enderecoHeader}
                                materias={materias}
                            />
                        </div>
                    )}
                </div>
            </div>

            <ContatoModal
                open={modalOpen}
                tutorNome={nome}
                telefone={telefone ?? ""}
                diaDaSemana={modalDia}
                startTime={modalInicio}
                endTime={modalFim}
                onClose={() => setModalOpen(false)}
            />
        </div>
    )
}
