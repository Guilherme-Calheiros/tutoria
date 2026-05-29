"use client"

import { UseFormSetValue, FieldErrors } from "react-hook-form"
import { SchemaPerfil } from "@/schemas/perfil"

type TipoAtendimentoSelectorProps = {
    ensinaPrivado?: boolean
    ensinaTurma?: boolean
    setValue: UseFormSetValue<SchemaPerfil>
    errors?: FieldErrors<SchemaPerfil>
}

export default function TipoAtendimentoSelector({
    ensinaPrivado,
    ensinaTurma,
    setValue,
    errors,
}: TipoAtendimentoSelectorProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
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
            {errors?.ensinaPrivado && (
                <p className="text-red-500 text-sm">{errors.ensinaPrivado.message}</p>
            )}
        </div>
    )
}
