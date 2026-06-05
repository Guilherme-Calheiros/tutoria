import { useEffect, useRef } from "react"

type MensagemProps = {
    type: "erro" | "sucesso"
    message: string | null
    onClose: () => void
    className?: string
    duration?: number
}

export default function Mensagem({ type, message, onClose, className = "", duration = 5000 }: MensagemProps) {
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const onCloseRef = useRef(onClose)
    onCloseRef.current = onClose

    useEffect(() => {
        if (!message || duration <= 0) return
        timerRef.current = setTimeout(() => onCloseRef.current(), duration)
        return () => clearTimeout(timerRef.current)
    }, [message, duration])

    if (!message) return null

    const isError = type === "erro"

    return (
        <div
            className={`flex items-start gap-2 text-sm rounded-lg px-4 py-2.5 ${className} ${
                isError
                    ? "text-destructive bg-red-50 border border-red-200"
                    : "text-green-700 bg-green-50 border border-green-200"
            }`}
            role={isError ? "alert" : "status"}
        >
            <span className="flex-1">{message}</span>
            <button
                type="button"
                onClick={() => onCloseRef.current()}
                className={`font-bold leading-none shrink-0 text-lg ${
                    isError
                        ? "text-destructive/60 hover:text-destructive"
                        : "text-green-500 hover:text-green-700"
                }`}
                aria-label="Fechar"
            >
                ×
            </button>
        </div>
    )
}
