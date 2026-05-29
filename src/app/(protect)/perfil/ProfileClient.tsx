"use client"

import { salvarPerfil } from "@/action/salvarPerfil";
import Campo from "@/app/components/CampoLabel";
import Section from "@/app/components/Section";
import { enderecoAtendimento, TutorSelect } from "@/lib/db/schema";
import { schemaPerfil, SchemaPerfil } from "@/schemas/perfil";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaPencilAlt } from "react-icons/fa";
import { IMaskInput } from "react-imask";
import AgendaClient from "./AgendaClient";
import TagSelector from "@/app/components/TagSelector";
import ModalidadeSelector from "@/app/components/ModalidadeSelector";
import TipoAtendimentoSelector from "@/app/components/TipoAtendimentoSelector";
import VoluntarioToggle from "@/app/components/VoluntarioToggle";
import PhotoUpload from "@/app/components/PhotoUpload";
import DeleteAccountSection from "@/app/components/DeleteAccountSection";
import UserAvatar from "@/app/components/UserAvatar";

type Materia = { id: number; nome: string }
type NivelEnsino = { id: number; nome: string }

type EnderecoSelect = typeof enderecoAtendimento.$inferSelect

type tutorData = (Omit<TutorSelect, "userId" | "onboardingCompleto"> & {
    materias: number[];
    niveisEnsino: number[];
    enderecos: EnderecoSelect[];
    disponibilidades: { diaDaSemana: number; startTime: string; endTime: string }[]
}) | null;

type ProfileClientProps = {
    userId: string;
    nome: string;
    telefone: string | null;
    image: string | null;
    role: string;
    tutorData: tutorData;
    todasMaterias: Materia[];
    todosNiveisEnsino: NivelEnsino[];
}

export default function ProfileClient({
    userId,
    nome,
    image,
    telefone,
    role,
    tutorData,
    todasMaterias,
    todosNiveisEnsino,
}: ProfileClientProps){
    const [editando, setEditando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState(false);
    const [emailEnviado, setEmailEnviado] = useState(false);

    useEffect(() => {
        if (!sucesso) return;
        const timer = setTimeout(() => setSucesso(false), 5000);
        return () => clearTimeout(timer);
    }, [sucesso])

    useEffect(() => {
        if (!emailEnviado) return;
        const timer = setTimeout(() => setEmailEnviado(false), 8000);
        return () => clearTimeout(timer);
    }, [emailEnviado])

    const { register, handleSubmit, watch, setValue, reset, control, formState: { errors, isSubmitting, dirtyFields } } = useForm<SchemaPerfil>({
        resolver: zodResolver(schemaPerfil),
        defaultValues: {
            nome,
            telefone: telefone ?? undefined,
            image: image ?? undefined,
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

    const materiasSelected = watch("materias") ?? [];
    const niveisEnsinoSelected = watch("niveisEnsino") ?? [];
    const ensinaPrivado = watch("ensinaPrivado");
    const ensinaTurma = watch("ensinaTurma");
    const voluntario = watch("voluntario");
    const modalidade = watch("modalidade");
    const telefoneWatched = watch("telefone")
    const descricaoWatched = watch("descricao")
    const enderecosWatched = watch("enderecos") ?? []

    const [fotoAtual, setFotoAtual] = useState<string | null>(image ?? null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [localPreview, setLocalPreview] = useState<string | null>(null)
    const [uploadando, setUploadando] = useState(false)

    const displayUrl = localPreview ?? fotoAtual

    const faltandoCampos: { label: string; campo: string }[] = [
        ...(!telefoneWatched ? [{ label: "Celular", campo: "telefone" }] : []),
        ...(!descricaoWatched ? [{ label: "Descrição", campo: "descricao" }] : []),
        ...(materiasSelected.length === 0 ? [{ label: "Matérias", campo: "materias" }] : []),
        ...(niveisEnsinoSelected.length === 0 ? [{ label: "Níveis de ensino", campo: "niveisEnsino" }] : []),
        ...(modalidade !== "ead" && enderecosWatched.length === 0 ? [{ label: "Endereços", campo: "enderecos" }] : []),
    ]

    const materiasOriginais = tutorData?.materias ?? [];
    const niveisEnsinoOriginais = tutorData?.niveisEnsino ?? [];

    function toggleMateria(id: number){
        const atual = materiasSelected
        setValue(
            "materias",
            atual.includes(id) ? atual.filter(m => m !== id) : [...atual, id],
            { shouldDirty: true}
        )
    }

    function toggleNivel(id: number) {
        const atual = niveisEnsinoSelected
        setValue(
            "niveisEnsino",
            atual.includes(id) ? atual.filter((n) => n !== id) : [...atual, id],
            { shouldDirty: true }
        )
    }

    function handleCancelar(){
        reset();
        setError(null);
        setFotoAtual(image ?? null);
        setSelectedFile(null)
        if (localPreview) URL.revokeObjectURL(localPreview)
        setLocalPreview(null)
        setEditando(false);
    }

    function arraysIguais(a: number[], b: number[]){
        if(a.length !== b.length) return false;

        const sortedA = [...a].sort((x,y) => x - y);
        const sortedB = [...b].sort((x,y) => x - y);

        return sortedA.every((v, i) => v === sortedB[i]);
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

    function handleFotoSelecionada(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        if (localPreview) URL.revokeObjectURL(localPreview)
        setSelectedFile(file)
        setLocalPreview(URL.createObjectURL(file))
        setError(null)
        e.target.value = ""
    }

    async function onSubmit(data: SchemaPerfil){
        setError(null);
        setSucesso(false);

        const diff: Partial<SchemaPerfil> = {};

        for(const key of Object.keys(dirtyFields) as Array<keyof SchemaPerfil>){
            if (key === "materias" || key === "niveisEnsino" || key === "voluntario" || key === "telefone") continue;
            diff[key] = data[key] as any;
        }

        if (role === "tutor" && data.voluntario !== tutorData?.voluntario) {
            diff.voluntario = data.voluntario;
        }

        if (data.telefone !== telefone) {
            diff.telefone = data.telefone;
        }

        const materiasDiff = !arraysIguais(
            materiasSelected,
            materiasOriginais
        );

        const niveisEnsinoDiff = !arraysIguais(
            niveisEnsinoSelected,
            niveisEnsinoOriginais
        );

        if (selectedFile) {
            setUploadando(true)
            const formData = new FormData()
            formData.set("file", selectedFile)
            const res = await fetch("/api/upload", { method: "POST", body: formData })
            setUploadando(false)
            let data
            try {
                data = await res.json()
            } catch {
                setError("Erro inesperado ao processar upload")
                return
            }
            if (!res.ok || data.error) { setError(data.error ?? "Erro ao enviar imagem"); return }
            diff.image = data.url
            setFotoAtual(data.url)
        }
        
        if(materiasDiff) diff.materias = materiasSelected;
        if(niveisEnsinoDiff) diff.niveisEnsino = niveisEnsinoSelected;
        
        if(Object.keys(diff).length === 0){
            setEditando(false);
            return;
        }

        const result = await salvarPerfil(userId, diff);

        if(result?.error){
            setError(result.error);
            return
        }

        setSelectedFile(null)
        if (localPreview) URL.revokeObjectURL(localPreview)
        setLocalPreview(null)
        setSucesso(true);
        setEditando(false);
        window.dispatchEvent(new CustomEvent("refreshNotificacoes"))
    }

    return (
        <div className="w-full max-w-5xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 py-4">
 
            <div className="flex flex-col">
                <h1 className="text-4xl font-semibold text-primary mb-8">
                    Meu Perfil
                </h1>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex flex-row gap-4 items-center">
                        <UserAvatar name={nome} src={fotoAtual} size="lg" />
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">{nome}</h2>
                            <p className="text-sm text-muted-foreground capitalize">{role}</p>
                        </div>
                    </div>
                    {!editando && (
                        <button
                            onClick={() => setEditando(true)}
                            className="flex items-center gap-2 border border-border rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                            <FaPencilAlt className="w-3 h-3" />
                            Editar perfil
                        </button>
                    )}
                </div>
            </div>
 
            {sucesso && (
                <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-6">
                    Perfil atualizado com sucesso!
                </p>
            )}

            {emailEnviado && (
                <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-6">
                    Enviamos um link de confirmação para seu e-mail. Clique no link para concluir a exclusão da sua conta.
                </p>
            )}

            {role === "tutor" && faltandoCampos.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6">
                    <p className="text-sm font-medium text-amber-800 mb-1">
                        {faltandoCampos.length === 1
                            ? "Falta apenas 1 campo para seu perfil ficar completo"
                            : `Faltam ${faltandoCampos.length} campos para seu perfil ficar completo`
                        }
                    </p>
                    <ul className="text-sm text-amber-700 space-y-0.5 list-disc list-inside">
                        {faltandoCampos.map(f => (
                            <li key={f.campo}>{f.label}</li>
                        ))}
                    </ul>
                </div>
            )}

            {!editando ? (
                <div className="flex flex-col gap-6">
                    <Section titulo="Informações básicas" >
                        <Campo label="Nome" valor={nome} />
                        <Campo label="Celular" valor={formatarTelefone(telefone) || "Não informado"} />
                    </Section>
 
                    {role === "tutor" && tutorData && (
                        <>
                            <Section titulo="Sobre a tutoria">
                                <Campo label="Descrição" valor={tutorData.descricao ?? "Não informado"} />
                                <Campo label="Modalidade" valor={tutorData.modalidade.toUpperCase()} />
                                {tutorData.enderecos.length > 0 && (
                                    <Section titulo="Regiões de atendimento">
                                        <div className="flex flex-col gap-3">
                                            {tutorData.enderecos.map((e) => (
                                                <div key={e.id} className="flex gap-2 text-sm text-foreground">
                                                    <span>{e.bairro},</span>
                                                    <span>{e.cidade}</span>
                                                    <span>— {e.estado}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                )}

                                {tutorData.modalidade !== "ead" && tutorData.enderecos.length === 0 && (
                                    <Section titulo="Regiões de atendimento">
                                        <p className="text-sm text-muted-foreground">Nenhum endereço cadastrado</p>
                                    </Section>
                                )}
                                <Campo label="Atendimento" valor={[tutorData.ensinaPrivado && "Particular", tutorData.ensinaTurma && "Turma"].filter(Boolean).join(" e ")} />
                                <Campo label="Forma de cobrança" valor={
                                    tutorData.voluntario === true
                                        ? "Tutor Voluntário" 
                                        : tutorData.valorHora 
                                            ? `R$ ${tutorData.valorHora} por hora` 
                                            : "A combinar"
                                }  />
                            </Section>
                            <Section titulo="Matérias">
                                <div className="flex flex-wrap gap-2">
                                    {todasMaterias
                                        .filter((m) => tutorData.materias.includes(m.id))
                                        .map((m) => (
                                            <span key={m.id} className="text-sm bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                                                {m.nome}
                                            </span>
                                        ))}
                                    {tutorData.materias.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma matéria cadastrada</p>}
                                </div>
                            </Section>
                            <Section titulo="Níveis de ensino">
                                <div className="flex flex-wrap gap-2">
                                    {todosNiveisEnsino
                                        .filter((n) => tutorData.niveisEnsino.includes(n.id))
                                        .map((n) => (
                                            <span key={n.id} className="text-sm bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                                                {n.nome}
                                            </span>
                                        ))}
                                    {tutorData.niveisEnsino.length === 0 && <p className="text-sm text-muted-foreground">Nenhum nível cadastrado</p>}
                                </div>
                            </Section>

                            <Section titulo="Agenda de disponibilidade">
                                <AgendaClient blocosSalvos={tutorData?.disponibilidades ?? []} />
                            </Section>
                        </>
                    )}

                    <DeleteAccountSection
                        onError={(msg) => setError(msg)}
                        onEmailSent={() => setEmailEnviado(true)}
                    />
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
 
                    <Section titulo="Foto do perfil">
                        <PhotoUpload
                            username={nome}
                            displayUrl={displayUrl}
                            onFileChange={handleFotoSelecionada}
                            uploading={uploadando}
                            errorMessage={errors.image?.message}
                        />
                    </Section>
                    <Section titulo="Informações básicas">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-foreground">Nome completo</label>
                            <input {...register("nome")} className="field-default max-w-xs" />
                            {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-foreground">Celular</label>
                            <IMaskInput id="telefone" unmask={true} mask="(00) 00000-0000" placeholder="(00) 00000-0000" defaultValue={formatarTelefone(telefone)} onAccept={(value) => setValue("telefone", value, {
                                shouldDirty: true,
                                shouldValidate: true
                            })} className="field-default max-w-xs" />
                            {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone.message}</p>}
                        </div>
                    </Section>
 
                    {role === "tutor" && (
                        <>
                            <Section titulo="Descrição">
                                <div className="flex flex-col gap-1">
                                    <textarea {...register("descricao", {
                                        setValueAs: (value) => value.trim() === "" ? undefined : value
                                    })} rows={4} className="field-default resize-none" />
                                    {errors.descricao && <p className="text-red-500 text-sm">{errors.descricao.message}</p>}
                                </div>
                            </Section>

                            <Section titulo="Modalidade">
                                <ModalidadeSelector
                                    modalidade={modalidade}
                                    control={control}
                                    register={register}
                                    setValue={setValue}
                                    errors={errors}
                                />
                            </Section>

                            <Section titulo="Tipo de atendimento" subtitulo="Selecione pelo menos um">
                                <TipoAtendimentoSelector
                                    ensinaPrivado={ensinaPrivado}
                                    ensinaTurma={ensinaTurma}
                                    setValue={setValue}
                                    errors={errors}
                                />
                            </Section>

                            <Section titulo="Forma de cobrança">
                                <VoluntarioToggle
                                    voluntario={voluntario}
                                    valorHora={tutorData?.valorHora}
                                    register={register}
                                    setValue={setValue}
                                    errors={errors}
                                />
                            </Section>
 
                            <Section titulo="Matérias">
                                <TagSelector
                                    items={todasMaterias}
                                    selectedIds={materiasSelected}
                                    onToggle={toggleMateria}
                                    error={errors.materias?.message}
                                />
                            </Section>
 
                            <Section titulo="Níveis de ensino">
                                <TagSelector
                                    items={todosNiveisEnsino}
                                    selectedIds={niveisEnsinoSelected}
                                    onToggle={toggleNivel}
                                    error={errors.niveisEnsino?.message}
                                />
                            </Section>
                        </>
                    )}
 
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary text-primary-foreground rounded-lg px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isSubmitting ? "Salvando..." : "Salvar alterações"}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancelar}
                            className="border border-border rounded-lg px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>

                </form>
            )}

            {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                    {error}
                </p>
            )}
        </div>
    )
}