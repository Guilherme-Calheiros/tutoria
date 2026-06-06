"use client"

import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form"
import { IMaskInput } from "react-imask"
import { SchemaPerfil } from "@/schemas/perfil"

type VoluntarioToggleProps = {
    voluntario?: boolean
    valorHora?: string | null
    register: UseFormRegister<SchemaPerfil>
    setValue: UseFormSetValue<SchemaPerfil>
    errors: FieldErrors<SchemaPerfil>
}

function formatarValorParaInput(valor: string | null | undefined): string {
    if (!valor) return ""
    return valor.replace(".", ",")
}

export default function VoluntarioToggle({
    voluntario,
    valorHora,
    register,
    setValue,
    errors,
}: VoluntarioToggleProps) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">Atuo como voluntário</span>
                    <span className="text-xs text-muted-foreground">
                       Seu perfil será exibido como gratuito para os alunos
                    </span>
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
                            defaultValue={formatarValorParaInput(valorHora)}
                        />
                        <span className="text-sm text-muted-foreground">por hora</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Deixe vazio para combinar o valor depois</span>
                    {errors.valorHora && <p className="text-red-500 text-sm">{errors.valorHora.message}</p>}
                </div>
            )}
        </div>
    )
}