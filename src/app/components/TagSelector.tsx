type TagItem = { id: number; nome: string }

type TagSelectorProps = {
    items: TagItem[]
    selectedIds: number[]
    onToggle: (id: number) => void
    error?: string
}

export default function TagSelector({ items, selectedIds, onToggle, error }: TagSelectorProps) {
    return (
        <>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onToggle(item.id)}
                        className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                            selectedIds?.includes(item.id)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-foreground border-border hover:border-primary"
                        }`}
                    >
                        {item.nome}
                    </button>
                ))}
            </div>
        </>
    )
}
