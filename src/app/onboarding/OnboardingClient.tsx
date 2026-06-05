"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { schemaPerfil, SchemaPerfil } from "@/schemas/perfil"
import { salvarPerfil } from "@/action/salvarPerfil"
import { useRouter } from "next/navigation"
import { IMaskInput } from "react-imask"
import TagSelector from "@/app/components/TagSelector"
import { FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import ModalidadeSelector from "@/app/components/ModalidadeSelector"
import TipoAtendimentoSelector from "@/app/components/TipoAtendimentoSelector"
import VoluntarioToggle from "@/app/components/VoluntarioToggle"
import Mensagem from "@/app/components/Mensagem"

type Materia = { id: number; nome: string }
type NivelEnsino = { id: number; nome: string }

type OnboardingClientProps = {
    userId: string
    nome: string
    telefone: string | null
    tutorData: {
        descricao: string | null
        modalidade: "ead" | "presencial" | "ambos"
        ensinaTurma: boolean
        ensinaPrivado: boolean
        valorHora: string | null
        voluntario: boolean
        materias: number[]
        niveisEnsino: number[]
        enderecos: { id?: number; bairro: string; cidade: string; estado: string }[]
    } | null
    todasMaterias: Materia[]
    todosNiveisEnsino: NivelEnsino[]
}

const STEPS = [
    { titulo: "Contato", descricao: "Celular e descrição" },
    { titulo: "Matérias e níveis", descricao: "O que você ensina" },
    { titulo: "Modalidade e local", descricao: "Como e onde você dá aulas" },
]

export default function OnboardingClient({
    userId,
    nome,
    telefone,
    tutorData,
    todasMaterias,
    todosNiveisEnsino,
}: OnboardingClientProps) {
    const router = useRouter()
    const [passo, setPasso] = useState(0)
    const [mensagem, setMensagem] = useState<{ type: "sucesso" | "erro"; text: string } | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<SchemaPerfil>({
        resolver: zodResolver(schemaPerfil),
        defaultValues: {
            nome,
            telefone: telefone ?? undefined,
            descricao: tutorData?.descricao ?? undefined,
            modalidade: tutorData?.modalidade ?? "ead",
            ensinaTurma: tutorData?.ensinaTurma ?? false,
            ensinaPrivado: tutorData?.ensinaPrivado ?? true,
            valorHora: tutorData?.valorHora ?? undefined,
            voluntario: tutorData?.voluntario ?? false,
            materias: tutorData?.materias ?? [],
            niveisEnsino: tutorData?.niveisEnsino ?? [],
            enderecos: tutorData?.enderecos.map(e => ({
                id: e.id,
                bairro: e.bairro,
                cidade: e.cidade,
                estado: e.estado,
            })) ?? [],
        }
    })

    const materiasSelected = watch("materias") ?? []
    const niveisEnsinoSelected = watch("niveisEnsino") ?? []
    const modalidade = watch("modalidade")
    const voluntario = watch("voluntario")
    const enderecos = watch("enderecos") ?? []
    const ensinaPrivado = watch("ensinaPrivado")
    const ensinaTurma = watch("ensinaTurma")
    const telefoneValue = watch("telefone")

    function toggleMateria(id: number) {
        const atual = materiasSelected
        setValue("materias", atual.includes(id) ? atual.filter(m => m !== id) : [...atual, id], { shouldDirty: true })
    }

    function toggleNivel(id: number) {
        const atual = niveisEnsinoSelected
        setValue("niveisEnsino", atual.includes(id) ? atual.filter(n => n !== id) : [...atual, id], { shouldDirty: true })
    }

    function podeAvancar(): boolean {
        if (passo === 0) {
            const tel = telefoneValue?.replace(/\D/g, "") ?? ""
            return tel.length >= 10
        }
        if (passo === 1) return materiasSelected.length > 0 || niveisEnsinoSelected.length > 0
        if (passo === 2) {
            if (modalidade === "presencial" || modalidade === "ambos") {
                return enderecos.length > 0 && enderecos.every(e => e.bairro && e.cidade && e.estado)
            }
            return true
        }
        return true
    }

    async function onSubmit(data: SchemaPerfil) {
        setIsSubmitting(true)
        setMensagem(null)

        const result = await salvarPerfil(userId, data, true)
        if (result?.error) {
            setMensagem({ type: "erro", text: result.error })
            setIsSubmitting(false)
            return
        }

        router.push("/perfil")
    }

    function formatarTelefone(valor: string | null | undefined): string {
        if (!valor) return ""
        const digits = valor.replace(/\D/g, "")
        if (digits.length === 0) return ""
        const ddd = digits.slice(0, 2)
        const prefix = digits.slice(2, 7)
        const suffix = digits.slice(7, 11)
        let result = `(${ddd}`
        if (prefix) result += `) ${prefix}`
        if (suffix) result += `-${suffix}`
        return result
    }

    return (
        <div className="w-full max-w-2xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 py-4">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-semibold text-primary mb-2">
                    Complete seu perfil de tutor
                </h1>
                <p className="text-muted-foreground text-sm">
                    Preencha seu perfil em alguns passos para aparecer nas buscas
                </p>
            </div>

            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex flex-col items-center flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                i < passo
                                    ? "bg-primary text-primary-foreground"
                                    : i === passo
                                    ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                                    : "bg-muted text-muted-foreground"
                            }`}>
                                {i < passo ? <FaCheck className="w-3 h-3" /> : i + 1}
                            </div>
                            <span className={`text-xs mt-1.5 text-center hidden sm:block ${
                                i === passo ? "text-foreground font-medium" : "text-muted-foreground"
                            }`}>
                                {s.titulo}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="relative mt-3 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 rounded-full"
                        style={{ width: `${(passo / (STEPS.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                {passo === 0 && (
                    <div className="border border-border rounded-xl p-6 flex flex-col gap-6">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground mb-1">Celular <span className="text-xs text-muted-foreground font-normal">(obrigatório)</span></h2>
                            <p className="text-sm text-muted-foreground mb-3">
                                Seu telefone ficará visível para os alunos entrarem em contato
                            </p>
                            <IMaskInput
                                unmask={true}
                                mask="(00) 00000-0000"
                                placeholder="(00) 00000-0000"
                                defaultValue={formatarTelefone(telefone)}
                                onAccept={(value) => setValue("telefone", value, { shouldDirty: true, shouldValidate: true })}
                                className="field-default max-w-xs"
                            />
                            {errors.telefone && <p role="alert" className="text-destructive text-sm mt-1">{errors.telefone.message}</p>}
                            {(!telefoneValue || telefoneValue.replace(/\D/g, "").length < 10) && (
                                <p className="text-accent text-xs mt-1.5">
                                    Celular é a principal forma de contato com você
                                </p>
                            )}
                        </div>
                        <div className="border-t border-border pt-4">
                            <h2 className="text-lg font-semibold text-foreground mb-1">Descrição</h2>
                            <p className="text-sm text-muted-foreground mb-3">
                                Conte um pouco sobre sua experiência e metodologia de ensino
                            </p>
                            <textarea
                                {...register("descricao", {
                                    setValueAs: (value) => value.trim() === "" ? undefined : value
                                })}
                                rows={4}
                                className="field-default resize-none"
                                placeholder="Ex: Sou formado em Matemática pela UFRJ e dou aulas há 5 anos..."
                            />
                            {errors.descricao && <p role="alert" className="text-destructive text-sm mt-1">{errors.descricao.message}</p>}
                        </div>
                    </div>
                )}

                {passo === 1 && (
                    <div className="border border-border rounded-xl p-6 flex flex-col gap-6">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground mb-1">Matérias</h2>
                            <p className="text-sm text-muted-foreground mb-3">Selecione as matérias que você ensina</p>
                            <TagSelector
                                items={todasMaterias}
                                selectedIds={materiasSelected}
                                onToggle={toggleMateria}
                                error={errors.materias?.message}
                            />
                        </div>
                        <div className="border-t border-border pt-4">
                            <h2 className="text-lg font-semibold text-foreground mb-1">Níveis de ensino</h2>
                            <p className="text-sm text-muted-foreground mb-3">Selecione os níveis de ensino que você atende</p>
                            <TagSelector
                                items={todosNiveisEnsino}
                                selectedIds={niveisEnsinoSelected}
                                onToggle={toggleNivel}
                                error={errors.niveisEnsino?.message}
                            />
                        </div>
                    </div>
                )}

                {passo === 2 && (
                    <div className="border border-border rounded-xl p-6 flex flex-col gap-6">
                        <ModalidadeSelector
                            modalidade={modalidade}
                            control={control}
                            register={register}
                            setValue={setValue}
                            errors={errors}
                        />

                        <div className="border-t border-border pt-4">
                            <h2 className="text-sm font-semibold text-foreground tracking-wide mb-1">Tipo de atendimento</h2>
                            <p className="text-xs text-muted-foreground mb-3">Selecione pelo menos um</p>
                            <TipoAtendimentoSelector
                                ensinaPrivado={ensinaPrivado}
                                ensinaTurma={ensinaTurma}
                                setValue={setValue}
                                errors={errors}
                            />
                        </div>

                        <div className="border-t border-border pt-4">
                            <h2 className="text-sm font-semibold text-foreground tracking-wide mb-3">Forma de cobrança</h2>
                            <VoluntarioToggle
                                voluntario={voluntario}
                                valorHora={tutorData?.valorHora}
                                register={register}
                                setValue={setValue}
                                errors={errors}
                            />
                        </div>
                    </div>
                )}

                {mensagem && <Mensagem type={mensagem.type} message={mensagem.text} onClose={() => setMensagem(null)} />}

                <div className="flex items-center justify-between mt-6">
                    <button
                        type="button"
                        onClick={() => setPasso(Math.max(0, passo - 1))}
                        className={`inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            passo === 0
                                ? "invisible"
                                : "border border-border text-foreground hover:bg-muted"
                        }`}
                    >
                        <FaChevronLeft className="w-3 h-3" />
                        Voltar
                    </button>

                    <div className="flex items-center gap-2">
                        {passo > 0 && passo < STEPS.length - 1 && !podeAvancar() && (
                            <button
                                type="button"
                                onClick={() => setPasso(passo + 1)}
                                className="inline-flex items-center min-h-11 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Pular
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => {
                                if (passo < STEPS.length - 1) {
                                    setPasso(passo + 1)
                                } else {
                                    handleSubmit(onSubmit)()
                                }
                            }}
                            disabled={passo < STEPS.length - 1 ? !podeAvancar() : isSubmitting}
                            className="inline-flex items-center justify-center gap-2 min-h-11 bg-primary text-primary-foreground rounded-lg px-6 py-2 text-sm font-medium hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-opacity disabled:opacity-50"
                        >
                            {passo < STEPS.length - 1 ? (
                                <>
                                    Avançar
                                    <FaChevronRight className="w-3 h-3" />
                                </>
                            ) : (
                                isSubmitting ? "Salvando..." : "Concluir"
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
