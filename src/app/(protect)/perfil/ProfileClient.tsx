"use client"

import { salvarPerfil } from "@/action/salvarPerfil";
import Campo from "@/app/components/CampoLabel";
import Section from "@/app/components/Section";
import { schemaPerfil, SchemaPerfil } from "@/schemas/perfil";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPencilAlt } from "react-icons/fa";
import { IMaskInput } from "react-imask";

type Materia = { id: number; nome: string }
type NivelEnsino = { id: number; nome: string }

type tutorData = {
    descricao: string | null;
    modalidade: "ead" | "presencial" | "ambos";
    ensinaTurma: boolean;
    ensinaPrivado: boolean;
    valorHora: string | null;
    voluntario: boolean;
    materias: number[];
    niveisEnsino: number[];
} | null;

type ProfileClientProps = {
    userId: string;
    nome: string;
    telefone: string | null;
    role: string;
    tutorData: tutorData;
    todasMaterias: Materia[];
    todosNiveisEnsino: NivelEnsino[];
}

export default function ProfileClient({
    userId,
    nome,
    telefone,
    role,
    tutorData,
    todasMaterias,
    todosNiveisEnsino,
}: ProfileClientProps){
    const [editando, setEditando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState(false);

    const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting, dirtyFields } } = useForm<SchemaPerfil>({
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
        }
    })

    const materiasSelected = watch("materias") ?? [];
    const niveisEnsinoSelected = watch("niveisEnsino") ?? [];
    const voluntario = watch("voluntario");

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

    async function onSubmit(data: SchemaPerfil){
        setError(null);
        setSucesso(false);

        const diff: Partial<SchemaPerfil> = {};

        for(const key of Object.keys(dirtyFields) as Array<keyof SchemaPerfil>){
            if (key === "materias" || key === "niveisEnsino" || key === "voluntario") continue;
            diff[key] = data[key] as any;
        }

        if (data.voluntario !== tutorData?.voluntario) {
            diff.voluntario = data.voluntario;
        }

        const materiasDiff = !arraysIguais(
            materiasSelected,
            materiasOriginais
        );

        const niveisEnsinoDiff = !arraysIguais(
            niveisEnsinoSelected,
            niveisEnsinoOriginais
        );

        
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

        setSucesso(true);
        setEditando(false);
    }

    return (
        <div className="w-full max-w-5xl mx-auto mt-10 px-4">
 
            <div className="flex flex-col">
                <h1 className="text-4xl font-semibold text-primary mb-8">
                    Meu Perfil
                </h1>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">{nome}</h2>
                        <p className="text-sm text-muted-foreground capitalize">{role}</p>
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
                        <Campo label="Telefone" valor={telefone ?? "Não informado"} />
                    </Section>
 
                    {role === "tutor" && tutorData && (
                        <>
                            <Section titulo="Sobre a tutoria">
                                <Campo label="Descrição" valor={tutorData.descricao ?? "Não informado"} />
                                <Campo label="Modalidade" valor={tutorData.modalidade.toUpperCase()} />
                                <Campo label="Atendimento" valor={[tutorData.ensinaPrivado && "Particular", tutorData.ensinaTurma && "Turma"].filter(Boolean).join(" e ")} />
                                <Campo label="Forma de cobrança" valor={tutorData.voluntario ? "Tutor Voluntário" : tutorData.valorHora ? `R$ ${tutorData.valorHora} por hora` : "A combinar"} />
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
 
                    <Section titulo="Informações básicas">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-foreground">Nome completo</label>
                            <input {...register("nome")} className="field-default max-w-xs" />
                            {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-foreground">Telefone</label>
                            <IMaskInput id="telefone" mask="(00) 00000-0000" placeholder="(00) 00000-0000" onAccept={(value) => setValue("telefone", value, {
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
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-foreground">Modalidade</label>
                                    <select {...register("modalidade")} className="field-default max-w-xs">
                                        <option value="ead">EAD</option>
                                        <option value="presencial">Presencial</option>
                                        <option value="ambos">Ambos</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-foreground">Tipo de atendimento</label>
                                    <label className="flex items-center gap-2 text-sm text-foreground">
                                        <input type="checkbox" {...register("ensinaPrivado")} />
                                        Particular
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-foreground">
                                        <input type="checkbox" {...register("ensinaTurma")} />
                                        Turma
                                    </label>
                                    {errors.ensinaPrivado && <p className="text-red-500 text-sm">{errors.ensinaPrivado.message}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-foreground">Forma de cobrança</label>
                                    <label className="flex items-center gap-2 text-sm text-foreground">
                                        <input type="checkbox" {...register("voluntario", {
                                            onChange: (e) => {
                                                if(e.target.checked){
                                                    setValue("valorHora", undefined, {
                                                        shouldDirty: true,
                                                        shouldValidate: true
                                                    })
                                                }
                                            }
                                        })} />
                                        Atuo como voluntário
                                    </label>
                                    {!voluntario && (
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium text-foreground">
                                                Valor por hora
                                            </label>
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
                                                onAccept={(value) => setValue("valorHora", value, {
                                                    shouldDirty: true,
                                                    shouldValidate: true
                                                })}
                                                defaultValue={formatarValorParaInput(tutorData?.valorHora)}
                                            />
                                            <span className="text-xs text-muted-foreground">
                                                Deixe vazio caso prefira combinar o valor depois.
                                            </span>
                                        </div>
                                    )}
                                    {voluntario && (
                                        <div className="text-sm text-muted-foreground">
                                            Este tutor atua de forma voluntária.
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