export default function SkeletonCard() {
    return (
        <div className="bg-surface border border-border rounded-lg p-5 sm:p-6 animate-pulse space-y-3">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-border shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-border rounded w-2/3" />
                    <div className="h-3 bg-border rounded w-1/2" />
                </div>
            </div>
            <div className="flex gap-2">
                <div className="h-5 bg-border rounded-full w-16" />
                <div className="h-5 bg-border rounded-full w-20" />
            </div>
            <div className="h-3 bg-border rounded w-1/3" />
            <div className="space-y-1.5">
                <div className="h-3 bg-border rounded w-full" />
                <div className="h-3 bg-border rounded w-4/5" />
            </div>
        </div>
    )
}
