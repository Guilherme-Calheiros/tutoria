"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { FaSearch } from "react-icons/fa"
import TutorCard from "@/app/components/TutorCard"
import EmptyState from "@/app/components/EmptyState"
import { type TutorResult } from "@/lib/buscar-tutores"

type Materia = { id: number; nome: string }
type Tutor = TutorResult

type InicioClientProps = {
  nome: string
  materias: Materia[]
  tutores: Tutor[]
}

export default function InicioClient({ nome, materias, tutores }: InicioClientProps) {
  const router = useRouter()
  const [q, setQ] = useState("")
  const qInputRef = useRef<HTMLInputElement>(null)

  function handleQSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (qInputRef.current) qInputRef.current.blur()
    if (q.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(q.trim())}`)
    }
  }

  function handleMateriaClick(id: number) {
    router.push(`/buscar?materias=${id}`)
  }

  const temTutores = tutores.length > 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 min-h-[calc(100dvh-5rem)]">
      <section>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Olá, {nome}!
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          O que você quer aprender hoje?
        </p>
      </section>

      <section>
        <h2 className="text-sm text-foreground mb-3">
            Buscar
        </h2>
        <form onSubmit={handleQSubmit} role="search" className="relative mb-4">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            ref={qInputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pesquisar por nome, matéria, cidade, nível..."
            className="field-default w-full pl-11 pr-4 min-h-12 text-sm"
            aria-label="Pesquisar tutores"
          />
        </form>
        
        {materias.length > 0 && (
          <section>
            <div className="flex flex-wrap gap-2">
              {materias.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleMateriaClick(m.id)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full border border-border bg-surface text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {m.nome}
                </button>
              ))}
            </div>
          </section>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">
            Tutores em destaque
          </h2>
          <button
            type="button"
            onClick={() => router.push("/buscar")}
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todos
          </button>
        </div>
        {temTutores ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {tutores.map((tutor) => (
              <TutorCard key={tutor.userId} tutor={tutor} />
            ))}
          </div>
        ) : (
          <EmptyState message="Nenhum tutor cadastrado no momento." />
        )}
      </section>
    </div>
  )
}
