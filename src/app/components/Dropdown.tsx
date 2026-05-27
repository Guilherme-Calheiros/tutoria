"use client"

import { useRef, useEffect } from "react"

type DropdownProps = {
    trigger: React.ReactNode
    open: boolean
    onClose: () => void
    align?: "left" | "right"
    size?: "sm" | "md" | "lg" | "xl"
    className?: string
    children: React.ReactNode
}

const sizeClasses = {
    sm: "w-48",
    md: "w-56",
    lg: "w-64",
    xl: "w-72",
}

export default function Dropdown({ trigger, open, onClose, align = "right", size = "md", className = "", children }: DropdownProps) {
    const ref = useRef<HTMLDivElement>(null)
    const onCloseRef = useRef(onClose)
    onCloseRef.current = onClose

    useEffect(() => {
        if (!open) return

        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onCloseRef.current()
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onCloseRef.current()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEscape)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [open])

    return (
        <div className="relative" ref={ref}>
            {trigger}
            <div
                className={`absolute z-50 mt-2 ${
                    align === "right" ? "right-0" : "left-0"
                } border border-border rounded-xl bg-background shadow-sm overflow-hidden transition-all duration-200 ease-out origin-top-right ${sizeClasses[size]} ${className} ${
                    open
                        ? "opacity-100 scale-100 visible"
                        : "opacity-0 scale-95 invisible pointer-events-none"
                }`}
            >
                {children}
            </div>
        </div>
    )
}
