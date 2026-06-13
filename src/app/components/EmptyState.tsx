import { type ReactNode } from "react"

type EmptyStateProps = {
    message: string
    action?: { label: string; onClick: () => void }
    compact?: boolean
    children?: ReactNode
}

export default function EmptyState({ message, action, compact, children }: EmptyStateProps) {
    return (
        <div
            className={`text-center min-h-75 flex flex-col items-center justify-center border border-dashed border-border rounded-lg ${compact ? "py-16" : "py-20"
                }`}
        >
            {children}
            <p className="text-muted-foreground text-sm mb-1">{message}</p>
            {action && (
                <button
                    type="button"
                    onClick={action.onClick}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    {action.label}
                </button>
            )}
        </div>
    )
}
