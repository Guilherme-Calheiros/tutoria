"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { FaChevronDown } from "react-icons/fa"

type Option = { value: string; label: string }

type MultiSelectProps = {
    label: string
    options: Option[]
    selected: string[]
    onChange: (values: string[]) => void
    placeholder: string
}

export default function MultiSelect({ label, options, selected, onChange, placeholder }: MultiSelectProps) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const toggle = useCallback(
        (value: string) => {
            onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])
        },
        [selected, onChange],
    )

    const displayText = useMemo(() => {
        if (selected.length === 0) return placeholder
        const labels = selected
            .map((v) => options.find((o) => o.value === v)?.label)
            .filter(Boolean) as string[]
        if (labels.length <= 2) return labels.join(", ")
        return `${labels[0]} e +${labels.length - 1}`
    }, [selected, options, placeholder])

    return (
        <div ref={ref} className="relative">
            <p className="text-xs font-semibold text-foreground mb-1.5">{label}</p>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="field-default w-full min-h-11 text-xs px-3 flex items-center justify-between gap-2 cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className={selected.length > 0 ? "text-foreground truncate" : "text-muted-foreground truncate"}>
                    {displayText}
                </span>
                <FaChevronDown
                    className={`w-3 h-3 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && (
                <div
                    className="absolute z-20 top-full mt-1 left-0 right-0 bg-background border border-border rounded-lg shadow-lg p-2 max-h-60 overflow-y-auto"
                    role="listbox"
                    aria-label={label}
                >
                    {options.map((o) => (
                        <label
                            key={o.value}
                            role="option"
                            aria-selected={selected.includes(o.value)}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-surface cursor-pointer text-xs"
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(o.value)}
                                onChange={() => toggle(o.value)}
                                className="accent-primary w-3.5 h-3.5"
                                tabIndex={-1}
                                aria-hidden="true"
                            />
                            {o.label}
                        </label>
                    ))}
                </div>
            )}
        </div>
    )
}
