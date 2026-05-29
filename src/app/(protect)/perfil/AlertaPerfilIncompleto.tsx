type AlertaPerfilIncompletoProps = {
    faltando: { label: string; campo: string }[]
}

export default function AlertaPerfilIncompleto({ faltando }: AlertaPerfilIncompletoProps) {
    if (faltando.length === 0) return null

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6">
            <p className="text-sm font-medium text-amber-800 mb-1">
                {faltando.length === 1
                    ? "Falta apenas 1 campo para seu perfil ficar completo"
                    : `Faltam ${faltando.length} campos para seu perfil ficar completo`
                }
            </p>
            <ul className="text-sm text-amber-700 space-y-0.5 list-disc list-inside">
                {faltando.map(f => (
                    <li key={f.campo}>{f.label}</li>
                ))}
            </ul>
        </div>
    )
}
