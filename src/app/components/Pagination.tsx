"use client"

type PaginationProps = {
    page: number
    totalPages: number
    total?: number
    onPageChange: (page: number) => void
    compact?: boolean
}

const btn = "text-sm font-medium rounded-lg border border-border hover:bg-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-11 inline-flex items-center"

export default function Pagination({ page, totalPages, total, onPageChange, compact }: PaginationProps) {
    if (totalPages <= 1) return null

    const pages: (number | "...")[] = []
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
        pages.push(1)
        if (page > 3) pages.push("...")
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
        if (page < totalPages - 2) pages.push("...")
        pages.push(totalPages)
    }

    return (
        <nav aria-label="Navegação de páginas" className="flex items-center justify-between pt-6">
            {!compact && total !== undefined && (
                <p className="text-sm text-muted-foreground tabular-nums">
                    {total} tutor{total !== 1 ? "es" : ""}
                </p>
            )}
            <div className={`flex items-center gap-1 ${compact ? "ml-auto" : ""}`}>
                <button
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    className={`${btn} px-3 py-1.5`}
                    aria-label="Página anterior"
                >
                    Anterior
                </button>
                {pages.map((p, i) =>
                    p === "..." ? (
                        <span key={`e${i}`} className="px-2 text-muted-foreground text-sm">...</span>
                    ) : (
                        <button
                            key={p}
                            type="button"
                            onClick={() => onPageChange(p)}
                            aria-current={p === page ? "page" : undefined}
                            aria-label={p === page ? `Página ${p}` : `Ir para página ${p}`}
                            className={`w-11 h-11 text-sm font-medium rounded-lg transition-colors ${p === page
                                    ? "bg-primary text-primary-foreground"
                                    : "text-foreground hover:bg-surface"
                                }`}
                        >
                            {p}
                        </button>
                    ),
                )}
                <button
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    className={`${btn} px-3 py-1.5`}
                    aria-label="Próxima página"
                >
                    Próximo
                </button>
            </div>
        </nav>
    )
}
