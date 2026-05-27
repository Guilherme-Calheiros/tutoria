"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { FaBell, FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import UserAvatar from "@/app/components/UserAvatar";
import Dropdown from "@/app/components/Dropdown";

export default function NavBar() {
    const { data: session, isPending } = useSession()
    const [dropdownAberto, setDropdownAberto] = useState(false)
    const [notifAberto, setNotifAberto] = useState(false)
    const [notificacoes, setNotificacoes] = useState<{ id: string; tipo: string; mensagem: string; link: string }[]>([])
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        function fetchNotificacoes() {
            if (session) {
                fetch("/api/notificacoes")
                    .then(r => r.json())
                    .then(d => setNotificacoes(d.notificacoes ?? []))
                    .catch(() => setNotificacoes([]))
            } else {
                setNotificacoes([])
            }
        }

        fetchNotificacoes()

        window.addEventListener("refreshNotificacoes", fetchNotificacoes)
        return () => window.removeEventListener("refreshNotificacoes", fetchNotificacoes)
    }, [session])

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
                <div className="flex items-center gap-3">
                    <Dropdown
                        trigger={
                            <button
                                onClick={() => { setNotifAberto(!notifAberto); setDropdownAberto(false) }}
                                className="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <FaBell className="text-lg" />
                                {notificacoes.length > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full" />
                                )}
                            </button>
                        }
                        open={notifAberto}
                        onClose={() => setNotifAberto(false)}
                    >
                        <p className="px-4 py-3 text-sm text-muted-foreground">Notificações</p>
                        {notificacoes.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-muted-foreground">Nenhuma notificação</div>
                        ) : (
                            notificacoes.map(n => (
                                <Link
                                    key={n.id}
                                    href={n.link}
                                    onClick={() => { setNotifAberto(false); setDropdownAberto(false) }}
                                    className="block px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors border-b border-border last:border-b-0"
                                >
                                    {n.mensagem}
                                </Link>
                            ))
                        )}
                    </Dropdown>

                    <Dropdown
                        trigger={
                            <button
                                onClick={() => setDropdownAberto(!dropdownAberto)}
                                aria-expanded={dropdownAberto}
                                aria-haspopup="menu"
                                className="flex items-center gap-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-2 py-1 transition-colors hover:bg-muted"
                            >
                                <UserAvatar src={session.user.image} name={session.user.name} size="sm" />
                                <span className="hidden sm:inline">{session.user.name}</span>
                                <FaChevronDown
                                    className={`text-xs text-muted-foreground transition-transform duration-200 ${dropdownAberto ? "rotate-180" : ""}`}
                                />
                            </button>
                        }
                        open={dropdownAberto}
                        onClose={() => setDropdownAberto(false)}
                    >
                        <div role="menu">
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
                    </Dropdown>
                </div>
            )}
        </div>
    )
}
