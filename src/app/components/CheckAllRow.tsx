"use client"

import { useRef, useEffect } from "react"

type CheckAllRowProps = {
    checked: boolean
    indeterminate: boolean
    label: string
    onToggle: () => void
    className?: string
}

export default function CheckAllRow({ checked, indeterminate, label, onToggle, className = "" }: CheckAllRowProps) {
    const ref = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (ref.current) ref.current.indeterminate = indeterminate
    }, [indeterminate])

    return (
        <label className={`flex items-center gap-2 text-sm font-medium cursor-pointer py-0.5 border-b border-border pb-1.5 mb-1 ${className}`}>
            <input
                ref={ref}
                type="checkbox"
                checked={checked}
                onChange={onToggle}
                className="accent-primary"
            />
            {label}
        </label>
    )
}
