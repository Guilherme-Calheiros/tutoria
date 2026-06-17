"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { FaBell, FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import UserAvatar from "@/app/components/UserAvatar";
import Dropdown from "@/app/components/Dropdown";

export default function NavBar() {
    const { data: session, isPending, refetch } = useSession()
    const [dropdownAberto, setDropdownAberto] = useState(false)
    const [notifAberto, setNotifAberto] = useState(false)
    const [notificacoes, setNotificacoes] = useState<{ id: string; tipo: string; mensagem: string; link: string }[]>([])
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        let mounted = true

        function fetchNotificacoes() {
            if (session) {
                fetch("/api/notificacoes")
                    .then(r => r.json())
                    .then(d => { if (mounted) setNotificacoes(d.notificacoes ?? []) })
                    .catch(() => { if (mounted) setNotificacoes([]) })
            } else {
                if (mounted) setNotificacoes([])
            }
        }

        function handleRefreshAvatar() {
            refetch()
        }

        fetchNotificacoes()

        window.addEventListener("refreshNotificacoes", fetchNotificacoes)
        window.addEventListener("refreshAvatar", handleRefreshAvatar)
        return () => {
            mounted = false
            window.removeEventListener("refreshNotificacoes", fetchNotificacoes)
            window.removeEventListener("refreshAvatar", handleRefreshAvatar)
        }
    }, [session, refetch])

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
        <nav className="sticky top-0 z-30 w-full border-b border-border bg-background p-4 flex items-center justify-between">
            <span className="text-3xl font-semibold tracking-tight text-primary">tutoria</span>
        </nav>
    )

    const navLinks = [
        { href: "/inicio", label: "Início" },
        { href: "/buscar", label: "Tutores" },
    ]

    return (
        <nav className="sticky top-0 z-30 w-full border-b border-border bg-background p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
                <Link href={session ? "/inicio" : "/"} className="text-3xl font-semibold tracking-tight text-primary shrink-0">
                    tutoria
                </Link>

                {session && (
                    <div className="hidden sm:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                                        isActive
                                            ? "text-primary mb-1 border-b-2 border-primary"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>

            {!session && (
                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="inline-flex items-center min-h-11 px-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                        Entrar
                    </Link>
                    <Link
                        href="/cadastro"
                        className="text-sm font-medium bg-primary text-primary-foreground rounded-lg px-4 py-2 min-h-11 flex items-center hover:opacity-90 transition-opacity"
                    >
                        Cadastrar
                    </Link>
                </div>
            )}

            {session && (
                <div className="flex items-center gap-3">
                    <Dropdown
                        trigger={
                            <button
                                onClick={() => { setNotifAberto(!notifAberto); setDropdownAberto(false) }}
                                aria-label="Notificações"
                                aria-expanded={notifAberto}
                                className="relative min-w-11 min-h-11 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                                <FaBell className="text-lg" />
                                <span
                                    className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full transition-opacity duration-200 ${notificacoes.length > 0 ? 'opacity-100 bg-accent' : 'opacity-0'}`}
                                />
                            </button>
                        }
                        open={notifAberto}
                        onClose={() => setNotifAberto(false)}
                    >
                        <h3 className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notificações</h3>
                        {notificacoes.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-muted-foreground">Nenhuma notificação</div>
                        ) : (
                            notificacoes.map(n => (
                                <Link
                                    key={n.id}
                                    href={n.link}
                                    onClick={() => { setNotifAberto(false); setDropdownAberto(false) }}
                                    className="block px-4 py-3 text-sm text-foreground hover:bg-muted focus-visible:bg-muted focus-visible:outline-none transition-colors border-b border-border last:border-b-0"
                                >
                                    {n.mensagem}
                                </Link>
                            ))
                        )}
                    </Dropdown>

                    <Dropdown
                        trigger={
                            <button
                                onClick={() => { setDropdownAberto(!dropdownAberto); setNotifAberto(false) }}
                                aria-expanded={dropdownAberto}
                                aria-haspopup="menu"
                                className="flex items-center gap-2 min-h-11 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-2 py-1 transition-colors hover:bg-muted"
                            >
                                <UserAvatar src={session.user.image} name={session.user.name} alt={`Foto de ${session.user.name}`} size="sm" />
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
                            <div className="px-4 py-2 border-b border-border hidden sm:block">
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
                            <div className="px-4 border-b border-border sm:hidden">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            role="menuitem"
                                            onClick={() => setDropdownAberto(false)}
                                            className={`block px-0 py-2.5 text-sm transition-colors ${
                                                isActive
                                                    ? "text-primary font-medium"
                                                    : "text-foreground hover:text-muted-foreground"
                                            }`}
                                        >
                                            {link.label}
                                        </Link>
                                    )
                                })}
                            </div>
                            <button
                                role="menuitem"
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors"
                            >
                                <FaSignOutAlt className="text-xs" />
                                Sair
                            </button>
                        </div>
                    </Dropdown>
                </div>
            )}
        </nav>
    )
}
