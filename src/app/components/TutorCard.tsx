import Link from "next/link"
import { FaChevronRight, FaMapMarkerAlt } from "react-icons/fa"
import UserAvatar from "@/app/components/UserAvatar"
import { type TutorResult } from "@/lib/buscar-tutores"

function formatarPreco(t: { voluntario: boolean; valorHora: string | null }): string {
    if (t.voluntario) return "Voluntário"
    if (t.valorHora) return `R$ ${t.valorHora}/h`
    return "A combinar"
}

function resumirModalidade(valor: string): string {
    if (valor === "ead") return "EAD"
    if (valor === "presencial") return "Presencial"
    return "EAD + Presencial"
}

function formatarCidades(enderecos: { bairro: string; cidade: string; estado: string }[]): string {
    if (enderecos.length === 0) return ""
    const cidades = [...new Set(enderecos.map((e) => `${e.cidade}, ${e.estado}`))]
    if (cidades.length <= 2) return cidades.join(" e ")
    return `${cidades[0]} e +${cidades.length - 1}`
}

type TutorCardProps = {
    tutor: TutorResult
}

export default function TutorCard({ tutor }: TutorCardProps) {
    const materiasPreview = tutor.materias.slice(0, 4)
    const materiasExtra = tutor.materias.length - materiasPreview.length

    return (
        <div className="bg-surface border border-border rounded-lg p-5 sm:p-6 flex flex-col gap-3 transition-shadow hover:shadow-sm">
            <div className="flex items-start gap-3">
                <Link href={`/tutor/${tutor.userId}`} className="shrink-0">
                    <UserAvatar name={tutor.nome} src={tutor.image} size="md" />
                </Link>
                <div className="min-w-0 flex-1">
                    <Link
                        href={`/tutor/${tutor.userId}`}
                        className="text-base font-semibold text-foreground hover:text-primary transition-colors"
                    >
                        {tutor.nome}
                    </Link>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {materiasPreview.map((m) => (
                            <span
                                key={m.id}
                                className="text-[11px] font-medium bg-background text-muted-foreground px-2 py-0.5 rounded-full border border-border"
                            >
                                {m.nome}
                            </span>
                        ))}
                        {materiasExtra > 0 && (
                            <span className="text-[11px] font-medium text-muted-foreground px-1">+{materiasExtra}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${tutor.modalidade === "ead"
                            ? "bg-primary/10 text-primary"
                            : tutor.modalidade === "presencial"
                                ? "bg-accent/10 text-accent"
                                : "bg-secondary text-secondary-foreground"
                        }`}
                >
                    {resumirModalidade(tutor.modalidade)}
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground bg-background border border-border px-2.5 py-0.5 rounded-full">
                    {formatarPreco(tutor)}
                </span>
            </div>

            {tutor.enderecos.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FaMapMarkerAlt className="w-3 h-3 shrink-0" />
                    <span>{formatarCidades(tutor.enderecos)}</span>
                </div>
            )}

            {tutor.niveis.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {tutor.niveis.slice(0, 3).map((n, idx) => (
                        <span key={n.id} className="text-[11px] text-muted-foreground">
                            {n.nome}
                            {idx < Math.min(tutor.niveis.length, 3) - 1 ? " ·" : ""}
                        </span>
                    ))}
                    {tutor.niveis.length > 3 && (
                        <span className="text-[11px] text-muted-foreground">· +{tutor.niveis.length - 3}</span>
                    )}
                </div>
            )}

            {tutor.descricao && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{tutor.descricao}</p>
            )}

            <div className="flex justify-end pt-1">
                <Link
                    href={`/tutor/${tutor.userId}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                    Ver perfil
                    <FaChevronRight className="w-2.5 h-2.5" />
                </Link>
            </div>
        </div>
    )
}
