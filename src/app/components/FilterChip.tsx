import { FaTimes } from "react-icons/fa"

type FilterChipProps = {
    label: string
    onRemove: () => void
}

export default function FilterChip({ label, onRemove }: FilterChipProps) {
    return (
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium">
            {label}
            <button
                type="button"
                onClick={onRemove}
                aria-label={`Remover ${label}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
            >
                <FaTimes className="w-2.5 h-2.5" />
            </button>
        </span>
    )
}
