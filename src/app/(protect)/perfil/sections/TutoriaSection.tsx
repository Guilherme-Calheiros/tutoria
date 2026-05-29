"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FaPencilAlt } from "react-icons/fa"
import { salvarPerfil } from "@/action/salvarPerfil"
import Section from "@/app/components/Section"
import Campo from "@/app/components/CampoLabel"
import ModalidadeSelector from "@/app/components/ModalidadeSelector"
import TipoAtendimentoSelector from "@/app/components/TipoAtendimentoSelector"
import VoluntarioToggle from "@/app/components/VoluntarioToggle"

const schema = z.object({
    modalidade: z.enum(["ead", "presencial", "ambos"]),
    ensinaTurma: z.boolean(),
    ensinaPrivado: z.boolean(),
    valorHora: z.string().optional(),
    voluntario: z.boolean(),
    enderecos: z.array(z.object({
        id: z.number().optional(),
        bairro: z.string().min(1, "Bairro obrigatório"),
        cidade: z.string().min(1, "Cidade obrigatória"),
        estado: z.string().min(2, "Estado obrigatório"),
    })).optional(),
}).superRefine((data, ctx) => {
    if (!data.ensinaPrivado && !data.ensinaTurma) {
        ctx.addIssue({
            code: "custom",
            message: "Selecione pelo menos um tipo de atendimento",
            path: ["ensinaPrivado"],
        })
    }
    if ((data.modalidade === "ambos" || data.modalidade === "presencial") && (!data.enderecos || data.enderecos.length === 0)) {
        ctx.addIssue({
            code: "custom",
            message: "Adicione pelo menos um endereço para atendimento presencial",
            path: ["enderecos"],
        })
    }
    if (data.voluntario && data.valorHora) {
        ctx.addIssue({
            code: "custom",
            message: "Voluntários não devem possuir valor por hora.",
            path: ["valorHora"],
        })
    }
})

type FormData = z.infer<typeof schema>

type EnderecoInput = { id?: number; bairro: string; cidade: string; estado: string }

type TutoriaSectionProps = {
    userId: string
    modalidade: string
    enderecos: EnderecoInput[]
    ensinaPrivado: boolean
    ensinaTurma: boolean
    valorHora: string | null
    voluntario: boolean
}

export default function TutoriaSection({
    userId,
    modalidade: modalidadeInicial,
    enderecos: enderecosIniciais,
    ensinaPrivado: privadoInicial,
    ensinaTurma: turmaInicial,
    valorHora: valorInicial,
    voluntario: voluntarioInicial,
}: TutoriaSectionProps) {
    const [editando, setEditando] = useState(false)
    const [hover, setHover] = useState(false)
    const [erro, setErro] = useState<string | null>(null)

    const defaultValues = {
        modalidade: modalidadeInicial as FormData["modalidade"],
        ensinaPrivado: privadoInicial,
        ensinaTurma: turmaInicial,
        valorHora: valorInicial ?? undefined,
        voluntario: voluntarioInicial,
        enderecos: enderecosIniciais,
    }

    const { register, handleSubmit, watch, setValue, setError, control, trigger, reset, formState: { errors, isSubmitting, dirtyFields } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues,
    })

    const modalidade = watch("modalidade")
    const voluntario = watch("voluntario")
    const ensinaPrivado = watch("ensinaPrivado")
    const ensinaTurma = watch("ensinaTurma")

    useEffect(() => {
        if (!erro) return
        const timer = setTimeout(() => setErro(null), 5000)
        return () => clearTimeout(timer)
    }, [erro])

    useEffect(() => {
        reset(defaultValues)
        trigger(["enderecos"])
    }, [
        reset, trigger,
        modalidadeInicial, privadoInicial, turmaInicial,
        valorInicial, voluntarioInicial, enderecosIniciais,
    ])

    useEffect(() => {
        trigger(["enderecos"])
    }, [modalidade, trigger])

    async function onSubmit(data: FormData) {
        const diff: Record<string, unknown> = {}

        for (const key of Object.keys(dirtyFields) as Array<keyof FormData>) {
            if (key === "enderecos") continue
            diff[key] = data[key] as any
        }

        if (data.voluntario !== voluntarioInicial) {
            diff.voluntario = data.voluntario
        }

        const enderecosDiff =
            JSON.stringify(data.enderecos?.map(e => ({ bairro: e.bairro, cidade: e.cidade, estado: e.estado }))) !==
            JSON.stringify(enderecosIniciais.map(e => ({ bairro: e.bairro, cidade: e.cidade, estado: e.estado })))

        if (enderecosDiff) diff.enderecos = data.enderecos

        if (diff.modalidade === "presencial" || diff.modalidade === "ambos") {
            diff.enderecos = data.enderecos
        }
        if (diff.modalidade === "ead") {
            diff.enderecos = []
        }

        if (Object.keys(diff).length === 0) {
            setEditando(false)
            return
        }

        const result = await salvarPerfil(userId, diff)
        if (result?.validationErrors) {
            for (const formError of result.validationErrors) {
                setError(formError.path as keyof FormData, { message: formError.message })
            }
            return
        }
        if (result?.error) {
            setErro(result.error)
            return
        }

        setEditando(false)
        window.dispatchEvent(new CustomEvent("refreshNotificacoes"))
    }

    if (!editando) {
        return (
            <Section
                titulo="Sobre a tutoria"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                action={
                    hover && (
                        <button
                            type="button"
                            onClick={() => setEditando(true)}
                            className="text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                        >
                            <FaPencilAlt className="w-3.5 h-3.5" />
                        </button>
                    )
                }
            >
                <Campo label="Modalidade" valor={modalidadeInicial.toUpperCase()} />
                {enderecosIniciais.length > 0 && (
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-muted-foreground">Regiões de atendimento</p>
                        <div className="flex flex-col gap-3">
                            {enderecosIniciais.map((e, i) => (
                                <div key={e.id ?? i} className="flex gap-2 text-sm text-foreground">
                                    <span>{e.bairro},</span>
                                    <span>{e.cidade}</span>
                                    <span>— {e.estado}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <Campo label="Tipo de atendimento" valor={[privadoInicial && "Particular", turmaInicial && "Turma"].filter(Boolean).join(" e ")} />

                <Campo label="Forma de cobrança" valor={
                    voluntarioInicial
                        ? "Tutor Voluntário"
                        : valorInicial
                            ? `R$ ${valorInicial} por hora`
                            : "A combinar"
                } />
            </Section>
        )
    }

    return (
        <Section titulo="Sobre a tutoria">
            {erro && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                    {erro}
                </p>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground">Modalidade</p>
                    <ModalidadeSelector
                        modalidade={modalidade}
                        control={control as any}
                        register={register as any}
                        setValue={setValue as any}
                        errors={errors as any}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground">Tipo de atendimento</p>
                    <TipoAtendimentoSelector
                        ensinaPrivado={ensinaPrivado}
                        ensinaTurma={ensinaTurma}
                        setValue={setValue as any}
                        errors={errors as any}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground">Forma de cobrança</p>
                    <VoluntarioToggle
                        voluntario={voluntario}
                        valorHora={valorInicial}
                        register={register as any}
                        setValue={setValue as any}
                        errors={errors as any}
                    />
                </div>
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary text-primary-foreground rounded-lg px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isSubmitting ? "Salvando..." : "Salvar"}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            reset(defaultValues)
                            setEditando(false)
                        }}
                        className="border border-border rounded-lg px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </Section>
    )
}
