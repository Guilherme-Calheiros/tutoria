"use client"

import { salvarPerfil } from "@/action/salvarPerfil";
import Campo from "@/app/components/CampoLabel";
import Section from "@/app/components/Section";
import { enderecoAtendimento, TutorSelect } from "@/lib/db/schema";
import { schemaPerfil, SchemaPerfil } from "@/schemas/perfil";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FaPencilAlt, FaTrash, FaUser } from "react-icons/fa";
import { IMaskInput } from "react-imask";

type Materia = { id: number; nome: string }
type NivelEnsino = { id: number; nome: string }

type EnderecoSelect = typeof enderecoAtendimento.$inferSelect

type tutorData = (Omit<TutorSelect, "userId"> & {
    materias: number[];
    niveisEnsino: number[];
    enderecos: EnderecoSelect[];
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

    const { fields, append, remove } = useFieldArray({
        control,
        name: "enderecos"
    })

    const materiasSelected = watch("materias") ?? [];
    const niveisEnsinoSelected = watch("niveisEnsino") ?? [];
    const ensinaPrivado = watch("ensinaPrivado");
    const ensinaTurma = watch("ensinaTurma");
    const voluntario = watch("voluntario");
    const modalidade = watch("modalidade");

    const [fotoAtual, setFotoAtual] = useState<string | null>(image ?? null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [localPreview, setLocalPreview] = useState<string | null>(null)
    const [uploadando, setUploadando] = useState(false)

    const displayUrl = localPreview ?? fotoAtual

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

    function formatarValorParaInput(valor: string | null | undefined): string {
        if (!valor) return ""
        return valor.replace(".", ",")
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
    }

    return (
        <div className="w-full max-w-5xl mx-auto mt-10 p-4">
 
            <div className="flex flex-col">
                <h1 className="text-4xl font-semibold text-primary mb-8">
                    Meu Perfil
                </h1>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-row gap-4 items-center">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-secondary flex items-center justify-center shrink-0">
                            {fotoAtual ? (
                                <img src={fotoAtual} alt="Foto de perfil" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl text-primary"><FaUser /></span>
                            )}
                        </div>
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
 
            {!editando ? (
                <div className="flex flex-col gap-6">
                    <Section titulo="Informações básicas" >
                        <Campo label="Nome" valor={nome} />
                        <Campo label="Telefone" valor={formatarTelefone(telefone) || "Não informado"} />
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
                        </>
                    )}
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
 
                    <Section titulo="Foto do perfil">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary flex items-center justify-center shrink-0">
                                {displayUrl ? (
                                    <img src={displayUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl text-primary"><FaUser /></span>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="foto"
                                    className={`cursor-pointer text-sm font-medium text-primary hover:underline w-fit ${uploadando ? "opacity-50 pointer-events-none" : ""}`}
                                >
                                    {uploadando ? "Enviando..." : "Alterar foto"}
                                </label>
                                <input
                                    id="foto"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={handleFotoSelecionada}
                                />
                                <span className="text-xs text-muted-foreground">JPG, PNG ou WebP — máx. 2MB</span>
                            </div>
                        </div>
                    </Section>
                    <Section titulo="Informações básicas">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-foreground">Nome completo</label>
                            <input {...register("nome")} className="field-default max-w-xs" />
                            {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-foreground">Telefone</label>
                            <IMaskInput id="telefone" unmask={true} mask="(00) 00000-0000" placeholder="(00) 00000-0000" defaultValue={formatarTelefone(telefone)} onAccept={(value) => setValue("telefone", value, {
                                shouldDirty: true,
                                shouldValidate: true
                            })} className="field-default max-w-xs" />
                        </div>
                    </Section>
 
                    {role === "tutor" && (
                        <>
                            <Section titulo="Sobre a tutoria">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-foreground">Descrição</label>
                                    <textarea {...register("descricao", {
                                        setValueAs: (value) => value.trim() === "" ? undefined : value
                                    })} rows={4} className="field-default resize-none" />
                                    {errors.descricao && <p className="text-red-500 text-sm">{errors.descricao.message}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-foreground">
                                        Como você prefere dar aulas?
                                    </label>
                                    <div className="flex gap-2">
                                        {(["ead", "presencial", "ambos"] as const).map((op) => (
                                            <button
                                                key={op}
                                                type="button"
                                                onClick={() => setValue("modalidade", op, { shouldDirty: true })}
                                                className={`px-4 py-2 rounded-full text-sm border transition-colors capitalize ${
                                                    modalidade === op
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "bg-background text-foreground border-border hover:border-primary"
                                                }`}
                                            >
                                                {op === "ead" ? "EAD" : op}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {modalidade !== "ead" && (
                                    <div className="flex flex-col gap-3 mt-2">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium text-foreground">Regiões de atendimento</label>
                                            <span className="text-xs text-muted-foreground">Adicione os locais onde você atende presencialmente</span>
                                        </div>

                                        {fields.map((field, index) => (
                                            <div key={field.id} className="relative bg-muted rounded-xl p-4 flex flex-col gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                                >
                                                    <FaTrash className="w-3 h-3" />
                                                </button>
                                                <div className="grid grid-cols-3 gap-3 pr-8">
                                                    <div className="flex flex-col gap-1">
                                                        <label className="text-xs font-medium text-foreground">Cidade</label>
                                                        <input
                                                            className="field-default"
                                                            placeholder="Ex: Rio de Janeiro"
                                                            {...register(`enderecos.${index}.cidade`)}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <label className="text-xs font-medium text-foreground">Bairro</label>
                                                        <input
                                                            className="field-default"
                                                            placeholder="Ex: Botafogo"
                                                            {...register(`enderecos.${index}.bairro`)}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <label className="text-xs font-medium text-foreground">Estado</label>
                                                        <input
                                                            className="field-default max-w-20"
                                                            placeholder="Ex: RJ"
                                                            {...register(`enderecos.${index}.estado`)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => append({ bairro: "", cidade: "", estado: "" })}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors w-fit"
                                        >
                                            <span className="text-base leading-none">+</span>
                                            Adicionar região
                                        </button>

                                        {errors.enderecos && (
                                            <p className="text-red-500 text-sm">{errors.enderecos.message}</p>
                                        )}
                                    </div>
                                )}
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-0.5">
                                        <label className="text-sm font-medium text-foreground">Tipo de atendimento</label>
                                        <span className="text-xs text-muted-foreground">Selecione pelo menos um</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setValue("ensinaPrivado", !ensinaPrivado, { shouldDirty: true, shouldValidate: true })}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-colors ${
                                                ensinaPrivado
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-background text-foreground border-border hover:border-primary"
                                            }`}
                                        >
                                            Particular
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setValue("ensinaTurma", !ensinaTurma, { shouldDirty: true, shouldValidate: true })}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-colors ${
                                                ensinaTurma
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-background text-foreground border-border hover:border-primary"
                                            }`}
                                        >
                                            Turma
                                        </button>
                                    </div>

                                    {errors.ensinaPrivado && (
                                        <p className="text-red-500 text-sm">{errors.ensinaPrivado.message}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-medium text-foreground">Forma de cobrança</label>

                                    <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-medium text-foreground">Atuo como voluntário</span>
                                            <span className="text-xs text-muted-foreground">Seu perfil será exibido como gratuito para os alunos</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                {...register("voluntario", {
                                                    onChange: (e) => {
                                                        if (e.target.checked) {
                                                            setValue("valorHora", undefined, { shouldDirty: true, shouldValidate: true })
                                                        }
                                                    }
                                                })}
                                            />
                                            <div className="w-10 h-6 bg-border rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.75 after:left-0.75 after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:after:translate-x-4" />
                                        </label>
                                    </div>

                                    {!voluntario && (
                                        <div className="flex flex-col gap-2 p-4 rounded-xl bg-muted">
                                            <label className="text-sm font-medium text-foreground">Valor por hora</label>
                                            <div className="flex items-center gap-3">
                                                <IMaskInput
                                                    mask="R$ num"
                                                    blocks={{
                                                        num: {
                                                            mask: Number,
                                                            scale: 2,
                                                            thousandsSeparator: ".",
                                                            padFractionalZeros: true,
                                                            radix: ",",
                                                            min: 0,
                                                            max: 9999,
                                                        }
                                                    }}
                                                    placeholder="R$ 0,00"
                                                    className="field-default max-w-xs"
                                                    unmask={true}
                                                    onAccept={(value) => setValue("valorHora", value, { shouldDirty: true, shouldValidate: true })}
                                                    defaultValue={formatarValorParaInput(tutorData?.valorHora)}
                                                />
                                                <span className="text-sm text-muted-foreground">por hora</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">Deixe vazio para combinar o valor depois</span>
                                        </div>
                                    )}
                                </div>
                            </Section>
 
                            <Section titulo="Matérias">
                                {errors.materias && <p className="text-red-500 text-sm mb-2">{errors.materias.message}</p>}
                                <div className="flex flex-wrap gap-2">
                                    {todasMaterias.map((m) => (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => toggleMateria(m.id)}
                                            className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                                                materiasSelected?.includes(m.id)
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-background text-foreground border-border hover:border-primary"
                                            }`}
                                        >
                                            {m.nome}
                                        </button>
                                    ))}
                                </div>
                            </Section>
 
                            <Section titulo="Níveis de ensino">
                                {errors.niveisEnsino && <p className="text-red-500 text-sm mb-2">{errors.niveisEnsino.message}</p>}
                                <div className="flex flex-wrap gap-2">
                                    {todosNiveisEnsino.map((n) => (
                                        <button
                                            key={n.id}
                                            type="button"
                                            onClick={() => toggleNivel(n.id)}
                                            className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                                                niveisEnsinoSelected?.includes(n.id)
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-background text-foreground border-border hover:border-primary"
                                            }`}
                                        >
                                            {n.nome}
                                        </button>
                                    ))}
                                </div>
                            </Section>
                        </>
                    )}
 
                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                            {error}
                        </p>
                    )}
 
                    <div className="flex gap-3">
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
        </div>
    )
}