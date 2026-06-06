"use client"

import { useFieldArray, Control, UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form"
import { FaTrash } from "react-icons/fa"
import { SchemaPerfil } from "@/schemas/perfil"

type ModalidadeSelectorProps = {
    modalidade?: string
    control: Control<SchemaPerfil>
    register: UseFormRegister<SchemaPerfil>
    setValue: UseFormSetValue<SchemaPerfil>
    errors: FieldErrors<SchemaPerfil>
}

export default function ModalidadeSelector({
    modalidade,
    control,
    register,
    setValue,
    errors,
}: ModalidadeSelectorProps) {
    const { fields, append, remove } = useFieldArray({ control, name: "enderecos" })

    return (
        <div className="flex flex-col gap-3">

            <div className="flex flex-wrap gap-2">
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

            {(modalidade === "presencial" || modalidade === "ambos") && (
                <div className="flex flex-col gap-3 mt-2">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-foreground">Regiões de atendimento</label>
                        <span className="text-xs text-muted-foreground">
                            Adicione os locais onde você atende presencialmente
                        </span>
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
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
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
        </div>
    )
}
