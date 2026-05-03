"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { FaEnvelope } from "react-icons/fa"


export default function VerificarEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleReenviar() {
    setLoading(true)
    await authClient.sendVerificationEmail({
      email,
      callbackURL: "/inicio"
    })
    setEnviado(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md border border-border rounded-2xl p-8 bg-background shadow text-center flex flex-col items-center gap-4">

        <FaEnvelope className="text-primary w-16 h-16" />

        <h1 className="text-2xl font-bold text-foreground">
          Verifique seu e-mail
        </h1>

        <p className="text-muted-foreground text-sm">
          Enviamos um link de confirmação para{" "}
          <span className="text-foreground font-medium">{email}</span>.
          Clique no link para ativar sua conta.
        </p>

        {enviado ? (
          <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 w-full">
            E-mail reenviado com sucesso!
          </p>
        ) : (
          <p className="text-muted-foreground text-xs">
            Não recebeu?{" "}
            <button
              onClick={handleReenviar}
              disabled={loading}
              className="text-primary hover:underline font-medium disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Reenviar e-mail"}
            </button>
          </p>
        )}

        <Link
          href="/login"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Voltar para o login
        </Link>

      </div>
    </main>
  )
}