"use client"

import { useState, useRef, useEffect } from "react"
import { FaChevronDown, FaCircleNotch } from "react-icons/fa"

type FilterDropdownProps = {
    label: string
    active: boolean
    loading?: boolean
    onClose?: () => void
    onOpen?: () => void
    className?: string
    children: React.ReactNode
}

let counter = 0

export default function FilterDropdown({
    label,
    active,
    loading = false,
    onClose,
    onOpen,
    className = "",
    children,
}: FilterDropdownProps) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [id] = useState(() => `filter-dropdown-${++counter}`)

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                if (open) {
                    setOpen(false)
                    onClose?.()
                }
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [open, onClose])

    useEffect(() => {
        if (!open) return

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setOpen(false)
                onClose?.()
                buttonRef.current?.focus()
                return
            }

            if (e.key === "Tab" && panelRef.current) {
                const focusable = panelRef.current.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
                )
                const first = focusable[0]
                const last = focusable[focusable.length - 1]

                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault()
                        last?.focus()
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault()
                        first?.focus()
                    }
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [open, onClose])

    useEffect(() => {
        if (open && panelRef.current) {
            const first = panelRef.current.querySelector<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            )
            first?.focus()
        }
    }, [open])

    return (
        <div ref={ref} className="relative">
            <button
                ref={buttonRef}
                type="button"
                onClick={() => {
                    if (open) {
                        onClose?.()
                    } else {
                        onOpen?.()
                    }
                    setOpen((v) => !v)
                }}
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-controls={id}
                className={`
                    inline-flex items-center gap-1.5 h-9 px-4 rounded-full border text-sm whitespace-nowrap transition-colors
                    ${active
                        ? "bg-primary text-primary-foreground border-primary font-medium"
                        : "bg-background text-foreground border-border hover:border-foreground/40"
                    }
                `}
            >
                {loading && active ? (
                    <FaCircleNotch className="w-3 h-3 animate-spin" aria-hidden="true" />
                ) : (
                    <FaChevronDown
                        className={`w-2.5 h-2.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
                        aria-hidden="true"
                    />
                )}
                {label}
            </button>

            <div
                ref={panelRef}
                id={id}
                role="dialog"
                aria-label={label}
                className={`
                    absolute top-full mt-1.5 left-0 z-10 min-w-55
                    bg-background border border-border rounded-xl shadow-lg p-4
                    transition-all duration-150 ease-out origin-top-left
                    ${open
                        ? "opacity-100 scale-100 visible"
                        : "opacity-0 scale-95 invisible pointer-events-none"
                    }
                    ${className}
                `}
            >
                {children}
            </div>
        </div>
    )
}
