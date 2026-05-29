"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FaPencilAlt } from "react-icons/fa"
import { IMaskInput } from "react-imask"
import { salvarPerfil } from "@/action/salvarPerfil"
import UserAvatar from "@/app/components/UserAvatar"
import PhotoUpload from "@/app/components/PhotoUpload"
import Section from "@/app/components/Section"
import Campo from "@/app/components/CampoLabel"

const schema = z.object({
    nome: z.string().min(2, "Nome deve conter pelo menos 2 caracteres"),
    telefone: z.string().min(10, "Celular deve ter pelo menos 10 dígitos"),
    descricao: z.string().min(10, "Descrição deve conter pelo menos 10 caracteres").optional().or(z.literal("")),
})

type FormData = z.infer<typeof schema>

type SobreMimSectionProps = {
    userId: string
    nome: string
    telefone: string | null
    image: string | null
    role: string
    descricao: string | null
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

export default function SobreMimSection({
    userId, 
    nome: nomeInicial, 
    telefone: telefoneInicial,
    image: imageInicial, 
    role, 
    descricao: descricaoInicial,
}: SobreMimSectionProps) {
    const [editando, setEditando] = useState(false)
    const [hover, setHover] = useState(false)
    const [erro, setErro] = useState<string | null>(null)

    const [fotoAtual, setFotoAtual] = useState<string | null>(imageInicial)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [localPreview, setLocalPreview] = useState<string | null>(null)
    const [uploadando, setUploadando] = useState(false)

    const displayUrl = localPreview ?? fotoAtual

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, setError, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            nome: nomeInicial,
            telefone: telefoneInicial ?? "",
            descricao: descricaoInicial ?? "",
        }
    })

    useEffect(() => {
        if (!erro) return
        const timer = setTimeout(() => setErro(null), 5000)
        return () => clearTimeout(timer)
    }, [erro])

    useEffect(() => {
        reset({
            nome: nomeInicial,
            telefone: telefoneInicial ?? "",
            descricao: descricaoInicial ?? "",
        })
    }, [nomeInicial, telefoneInicial, descricaoInicial, reset])

    function handleFotoSelecionada(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        if (localPreview) URL.revokeObjectURL(localPreview)
        setSelectedFile(file)
        setLocalPreview(URL.createObjectURL(file))
        e.target.value = ""
    }

    async function onSubmit(data: FormData) {
        setErro(null)
        const diff: Record<string, unknown> = {}

        if (data.nome !== nomeInicial) diff.nome = data.nome
        if (data.telefone !== telefoneInicial) diff.telefone = data.telefone || undefined
        if (role === "tutor" && data.descricao !== descricaoInicial) {
            diff.descricao = data.descricao === undefined ? null : data.descricao
        }

        if (selectedFile) {
            setUploadando(true)
            const formData = new FormData()
            formData.set("file", selectedFile)
            const res = await fetch("/api/upload", { method: "POST", body: formData })
            setUploadando(false)
            if (!res.ok) { setErro("Erro ao fazer upload da foto"); return }
            const json = await res.json()
            if (json.error) { setErro(json.error); return }
            diff.image = json.url
            setFotoAtual(json.url)
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

        setSelectedFile(null)
        if (localPreview) URL.revokeObjectURL(localPreview)
        setLocalPreview(null)
        setEditando(false)
        window.dispatchEvent(new CustomEvent("refreshNotificacoes"))
        window.dispatchEvent(new CustomEvent("refreshAvatar"))
    }

    if (!editando) {
        return (
            <Section
                titulo="Sobre mim"
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
                <div className="flex items-center gap-4">
                    <UserAvatar name={nomeInicial} src={fotoAtual} size="lg" />
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">{nomeInicial}</h2>
                        <p className="text-sm text-muted-foreground capitalize">{role}</p>
                    </div>
                </div>
                <Campo label="Celular" valor={formatarTelefone(telefoneInicial) || "Não informado"} />
                {role === "tutor" && (
                    <Campo label="Descrição" valor={descricaoInicial || "Não informado"} />
                )}
            </Section>
        )
    }

    return (
        <Section titulo="Sobre mim">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <PhotoUpload
                    username={nomeInicial}
                    displayUrl={displayUrl}
                    onFileChange={handleFotoSelecionada}
                    uploading={uploadando}
                />
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-foreground">Nome completo</label>
                    <input {...register("nome")} className="field-default max-w-xs" />
                    {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-foreground">Celular</label>
                    <IMaskInput
                        unmask={true}
                        mask="(00) 00000-0000"
                        placeholder="(00) 00000-0000"
                        defaultValue={formatarTelefone(telefoneInicial)}
                        onAccept={(value) => setValue("telefone", value, { shouldDirty: true, shouldValidate: true })}
                        className="field-default max-w-xs"
                    />
                    {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone.message}</p>}
                </div>
                {role === "tutor" && (
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-foreground">Descrição</label>
                        <textarea
                            {...register("descricao", { setValueAs: (v) => v.trim() === "" ? undefined : v })}
                            rows={4}
                            className="field-default resize-none"
                        />
                        {errors.descricao && <p className="text-red-500 text-sm">{errors.descricao.message}</p>}
                    </div>
                )}
                {erro && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                        {erro}
                    </p>
                )}
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
                        onClick={() => { setEditando(false); setSelectedFile(null); if (localPreview) URL.revokeObjectURL(localPreview); setLocalPreview(null) }}
                        className="border border-border rounded-lg px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </Section>
    )
}
