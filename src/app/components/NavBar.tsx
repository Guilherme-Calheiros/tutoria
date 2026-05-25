"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { FaChevronDown, FaSignOutAlt } from "react-icons/fa";

export default function NavBar() {
    const { data: session, isPending } = useSession()
    const [dropdownAberto, setDropdownAberto] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownAberto(false)
            }
        }
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setDropdownAberto(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEscape)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [])

    async function handleSignOut(){
        setDropdownAberto(false)
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login");
                },
            },
        });
    }

    if (isPending) return (
        <div className="w-full border-b border-border p-4 flex items-center justify-between">
            <span className="text-3xl font-semibold tracking-tight text-primary">tutoria</span>
        </div>
    )

    return (
        <div className="w-full border-b border-border p-4 flex items-center justify-between">
            <Link href="/" className="text-3xl font-semibold tracking-tight text-primary">
                tutoria
            </Link>

            {session && (
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownAberto(!dropdownAberto)}
                        aria-expanded={dropdownAberto}
                        aria-haspopup="menu"
                        className="flex items-center gap-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-2 py-1 transition-colors hover:bg-muted"
                    >
                        {session.user.image ? (
                            <div className="w-7 h-7 rounded-full overflow-hidden bg-secondary flex items-center justify-center shrink-0">
                                <img src={session.user.image} alt="" className="w-full h-full object-cover"/>
                            </div>
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 text-xs font-medium text-primary">
                                {session.user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className="hidden sm:inline">{session.user.name}</span>
                        <FaChevronDown
                            className={`text-xs text-muted-foreground transition-transform duration-200 ${dropdownAberto ? "rotate-180" : ""}`}
                        />
                    </button>

                    <div
                        role="menu"
                        className={`absolute right-0 mt-2 w-48 border border-border rounded-xl bg-background shadow-sm overflow-hidden transition-all duration-200 ease-out origin-top-right ${
                            dropdownAberto
                                ? "opacity-100 scale-100 visible"
                                : "opacity-0 scale-95 invisible pointer-events-none"
                        }`}
                    >
                        <div className="px-4 py-2 border-b border-border">
                            <p className="text-xs text-muted-foreground">
                                {session.user.role === "tutor" ? "Tutor" : "Aluno"}
                            </p>
                        </div>
                        <Link
                            href="/perfil"
                            role="menuitem"
                            onClick={() => setDropdownAberto(false)}
                            className={`block px-4 py-2.5 text-sm transition-colors ${
                                pathname === "/perfil"
                                    ? "bg-secondary text-primary font-medium"
                                    : "text-foreground hover:bg-muted"
                            }`}
                        >
                            Meu perfil
                        </Link>
                        <button
                            role="menuitem"
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-muted transition-colors"
                        >
                            <FaSignOutAlt className="text-xs" />
                            Sair
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
