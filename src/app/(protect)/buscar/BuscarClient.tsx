"use client"

import { useState, useCallback, useEffect, useRef, useReducer, useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { FaSearch, FaTimes, FaCircleNotch } from "react-icons/fa"
import EmptyState from "@/app/components/EmptyState"
import Pagination from "@/app/components/Pagination"
import SkeletonCard from "@/app/components/SkeletonCard"
import TutorCard from "@/app/components/TutorCard"
import FilterDropdown from "@/app/components/FilterDropdown"
import CheckAllRow from "@/app/components/CheckAllRow"
import { type BuscarResult } from "@/lib/buscar-tutores"

type Materia = { id: number; nome: string }
type Nivel = { id: number; nome: string }

type BuscarClientProps = {
    todasMaterias: Materia[]
    todosNiveis: Nivel[]
    initialData: BuscarResult
}

type FilterState = {
    materias: string[]
    niveis: string[]
    modalidade: string
    precoMax: string
    voluntario: boolean
    cidade: string
    dias: string[]
    horaInicio: string
    horaFim: string
    q: string
}

const INITIAL_FILTER_STATE: FilterState = {
    materias: [],
    niveis: [],
    modalidade: "todos",
    precoMax: "",
    voluntario: false,
    cidade: "",
    dias: [],
    horaInicio: "",
    horaFim: "",
    q: "",
}

type FilterAction =
    | { type: "RESET" }
    | { type: "PATCH"; payload: Partial<FilterState> }

function filterReducer(state: FilterState, action: FilterAction): FilterState {
    if (action.type === "RESET") return INITIAL_FILTER_STATE
    return { ...state, ...action.payload }
}

const PAGE_SIZE = 8
const HORAS = Array.from({ length: 18 }, (_, i) => i + 6)

const DIAS_SEMANA = [
    { value: "1", label: "Seg" },
    { value: "2", label: "Ter" },
    { value: "3", label: "Qua" },
    { value: "4", label: "Qui" },
    { value: "5", label: "Sex" },
    { value: "6", label: "Sáb" },
    { value: "0", label: "Dom" },
]

const MODALIDADE_OPTIONS = [
    { value: "todos", label: "Ambos" },
    { value: "ead", label: "EAD" },
    { value: "presencial", label: "Presencial" },
] as const

function toggleItem(list: string[], item: string) {
    return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
}

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, ms: number) {
    let timer: ReturnType<typeof setTimeout>
    return (...args: Parameters<T>) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), ms)
    }
}

export default function BuscarClient(props: BuscarClientProps) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const [filters, dispatch] = useReducer(filterReducer, INITIAL_FILTER_STATE, () => ({
        materias: searchParams.get("materias")?.split(",").filter(Boolean) ?? [],
        niveis: searchParams.get("niveis")?.split(",").filter(Boolean) ?? [],
        modalidade: searchParams.get("modalidade") || "todos",
        precoMax: searchParams.get("precoMax") || "",
        voluntario: searchParams.get("voluntario") === "true",
        cidade: searchParams.get("cidade") || "",
        dias: searchParams.get("dias")?.split(",").filter(Boolean) ?? [],
        horaInicio: searchParams.get("horaInicio") || "",
        horaFim: searchParams.get("horaFim") || "",
        q: searchParams.get("q") || "",
    }))

    const {
        materias, niveis, modalidade, precoMax,
        voluntario, cidade, dias, horaInicio, horaFim, q,
    } = filters

    const qInputRef = useRef<HTMLInputElement>(null)
    const precoUltimoSubmit = useRef(precoMax)
    const cidadeUltimoSubmit = useRef(cidade)
    const hasUrlParams = Array.from(searchParams.entries()).length > 0

    const [searchKey, setSearchKey] = useState(() => (hasUrlParams ? 1 : 0))
    const [page, setPage] = useState(1)
    const [data, setData] = useState<BuscarResult>(() =>
        hasUrlParams
            ? { tutores: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 1 }
            : props.initialData,
    )
    const [loading, setLoading] = useState(hasUrlParams)
    const [erro, setErro] = useState(false)

    const hasFilters =
        materias.length > 0 ||
        niveis.length > 0 ||
        modalidade !== "todos" ||
        voluntario ||
        precoMax !== "" ||
        cidade !== "" ||
        dias.length > 0 ||
        horaInicio !== "" ||
        horaFim !== "" ||
        q !== ""

    const activeFilterCount =
        (materias.length > 0 ? 1 : 0) +
        (niveis.length > 0 ? 1 : 0) +
        (modalidade !== "todos" ? 1 : 0) +
        (voluntario ? 1 : 0) +
        (precoMax !== "" ? 1 : 0) +
        (cidade !== "" ? 1 : 0) +
        ((dias.length > 0 || horaInicio !== "" || horaFim !== "") ? 1 : 0)

    const isBuscaAtiva = searchKey > 0
    const mostrarTutores = !loading && !erro && data.tutores.length > 0
    const semTutores = !loading && !erro && !isBuscaAtiva && data.total === 0 && !hasFilters
    const semResultados = isBuscaAtiva && !loading && !erro && data.total === 0 && hasFilters

    const triggerSearch = useCallback(
        (patch: Partial<FilterState> = {}) => {
            const merged = { ...filters, ...patch }
            const params = new URLSearchParams()
            if (merged.materias.length) params.set("materias", merged.materias.join(","))
            if (merged.niveis.length) params.set("niveis", merged.niveis.join(","))
            if (merged.modalidade && merged.modalidade !== "todos") params.set("modalidade", merged.modalidade)
            if (merged.precoMax) params.set("precoMax", merged.precoMax)
            if (merged.voluntario) params.set("voluntario", "true")
            if (merged.cidade) params.set("cidade", merged.cidade)
            if (merged.dias.length) params.set("dias", merged.dias.join(","))
            if (merged.horaInicio) params.set("horaInicio", merged.horaInicio)
            if (merged.horaFim) params.set("horaFim", merged.horaFim)
            if (merged.q) params.set("q", merged.q)
            const qs = params.toString()
            router.push(qs ? `${pathname}?${qs}` : pathname)
            setPage(1)
            setSearchKey((k) => k + 1)
        },
        [filters, router, pathname],
    )

    const debouncedSearch = useMemo(
        () => debounce((patch: Partial<FilterState>) => triggerSearch(patch), 300),
        [triggerSearch],
    )

    const limparFiltros = useCallback(() => {
        dispatch({ type: "RESET" })
        router.push(pathname)
        setPage(1)
        setSearchKey((k) => k + 1)
    }, [router, pathname])

    const [dispDias, setDispDias] = useState(dias)
    const [dispInicio, setDispInicio] = useState(horaInicio)
    const [dispFim, setDispFim] = useState(horaFim)

    const limparMaterias = useCallback(() => {
        dispatch({ type: "PATCH", payload: { materias: [] } })
        triggerSearch({ materias: [] })
    }, [triggerSearch])

    const limparNiveis = useCallback(() => {
        dispatch({ type: "PATCH", payload: { niveis: [] } })
        triggerSearch({ niveis: [] })
    }, [triggerSearch])

    const sincronizarDisponibilidade = useCallback(() => {
        setDispDias(dias)
        setDispInicio(horaInicio)
        setDispFim(horaFim)
    }, [dias, horaInicio, horaFim])

    const redefinirDisponibilidade = useCallback(() => {
        setDispDias([])
        setDispInicio("")
        setDispFim("")
    }, [])

    const aplicarDisponibilidade = useCallback(() => {
        dispatch({ type: "PATCH", payload: { dias: dispDias, horaInicio: dispInicio, horaFim: dispFim } })
        triggerSearch({ dias: dispDias, horaInicio: dispInicio, horaFim: dispFim })
    }, [dispDias, dispInicio, dispFim, triggerSearch])

    const handlePageChange = useCallback(
        (nova: number) => {
            if (nova < 1 || nova > data.totalPages) return
            setPage(nova)
            const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
            window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" })
        },
        [data.totalPages],
    )

    useEffect(() => {
        if (searchKey === 0) return
        const fetchData = async () => {
            setLoading(true)
            setErro(false)
            const params = new URLSearchParams()
            if (materias.length) params.set("materias", materias.join(","))
            if (niveis.length) params.set("niveis", niveis.join(","))
            if (modalidade && modalidade !== "todos") params.set("modalidade", modalidade)
            if (voluntario) params.set("voluntario", "true")
            if (precoMax) params.set("precoMax", precoMax)
            if (cidade) params.set("cidade", cidade)
            if (dias.length) params.set("dias", dias.join(","))
            if (horaInicio) params.set("horaInicio", horaInicio)
            if (horaFim) params.set("horaFim", horaFim)
            if (q) params.set("q", q)
            params.set("page", String(page))
            params.set("pageSize", String(PAGE_SIZE))
            try {
                const res = await fetch(`/api/tutores/buscar?${params}`)
                if (!res.ok) throw new Error()
                const result: BuscarResult = await res.json()
                setData(result)
            } catch {
                setErro(true)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchKey, page])

    function handleQSubmit(e: React.FormEvent) {
        e.preventDefault()
        qInputRef.current?.blur()
        triggerSearch({ q })
    }

    const materiasLabel =
        materias.length === 0 ? "Matéria"
            : materias.length === 1 ? props.todasMaterias.find((m) => String(m.id) === materias[0])?.nome ?? "Matéria"
                : `Matéria (${materias.length})`

    const niveisLabel =
        niveis.length === 0 ? "Nível"
            : niveis.length === 1 ? props.todosNiveis.find((n) => String(n.id) === niveis[0])?.nome ?? "Nível"
                : `Nível (${niveis.length})`

    const modalidadeLabel =
        MODALIDADE_OPTIONS.find((o) => o.value === modalidade)?.label ?? "Modalidade"

    const precoLabel = precoMax ? `Até R$ ${precoMax}/h` : "Preço máx"
    const cidadeLabel = cidade || "Cidade"

    const disponibilidadeLabel = (() => {
        const parts = []
        if (dias.length > 0) parts.push(`Dias (${dias.length})`)
        if (horaInicio && horaFim) parts.push(`${horaInicio}–${horaFim}`)
        return parts.length > 0 ? parts.join(", ") : "Disponibilidade"
    })()

    return (
        <div className="min-h-[calc(100dvh-5rem)]">

            <div className="sticky top-0 z-20 bg-background">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <h1 className="text-lg sm:text-xl font-semibold text-foreground whitespace-nowrap">
                        Encontre um tutor
                    </h1>
                    <form
                        onSubmit={handleQSubmit}
                        role="search"
                        className="relative w-full sm:flex-1 sm:max-w-sm sm:ml-auto"
                    >
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" aria-hidden="true" />
                        <input
                            ref={qInputRef}
                            type="search"
                            value={q}
                            onChange={(e) => dispatch({ type: "PATCH", payload: { q: e.target.value } })}
                            placeholder="Nome, matéria, cidade..."
                            className="field-default w-full pl-10 pr-4 h-10 text-sm rounded-full"
                            aria-label="Pesquisar tutores"
                        />
                    </form>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex flex-wrap items-center gap-2">

                    <button
                        type="button"
                        onClick={() => {
                            const next = !voluntario
                            dispatch({ type: "PATCH", payload: { voluntario: next } })
                            triggerSearch({ voluntario: next })
                        }}
                        aria-pressed={voluntario}
                        className={`
                            inline-flex items-center h-9 px-4 rounded-full border text-sm whitespace-nowrap transition-colors shrink-0
                            ${voluntario
                                ? "bg-primary text-primary-foreground border-primary font-medium"
                                : "bg-background text-foreground border-border hover:border-foreground/40"
                            }
                        `}
                    >
                        {loading && voluntario && (
                            <FaCircleNotch className="w-3 h-3 animate-spin mr-1.5" aria-hidden="true" />
                        )}
                        Voluntário
                    </button>

                    <FilterDropdown label={materiasLabel} active={materias.length > 0} loading={loading}>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Matéria</p>
                        <CheckAllRow
                            checked={materias.length === props.todasMaterias.length}
                            indeterminate={materias.length > 0 && materias.length < props.todasMaterias.length}
                            label="Todas as matérias"
                            onToggle={() => {
                                const next = materias.length === props.todasMaterias.length
                                    ? [] : props.todasMaterias.map((m) => String(m.id))
                                dispatch({ type: "PATCH", payload: { materias: next } })
                                debouncedSearch({ materias: next })
                            }}
                        />
                        <div className="flex flex-col gap-1 max-h-52 overflow-y-auto">
                            {props.todasMaterias.map((m) => (
                                <label key={m.id} className="flex items-center gap-2 text-sm cursor-pointer py-0.5">
                                    <input
                                        type="checkbox"
                                        checked={materias.includes(String(m.id))}
                                        onChange={() => {
                                            const next = toggleItem(materias, String(m.id))
                                            dispatch({ type: "PATCH", payload: { materias: next } })
                                            debouncedSearch({ materias: next })
                                        }}
                                        className="accent-primary"
                                    />
                                    {m.nome}
                                </label>
                            ))}
                        </div>
                        {materias.length > 0 && (
                            <button
                                type="button"
                                onClick={limparMaterias}
                                className="mt-2 w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                            >
                                Limpar matérias
                            </button>
                        )}
                    </FilterDropdown>

                    <FilterDropdown label={niveisLabel} active={niveis.length > 0} loading={loading}>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Nível de ensino</p>
                        <CheckAllRow
                            checked={niveis.length === props.todosNiveis.length}
                            indeterminate={niveis.length > 0 && niveis.length < props.todosNiveis.length}
                            label="Todos os níveis"
                            onToggle={() => {
                                const next = niveis.length === props.todosNiveis.length
                                    ? [] : props.todosNiveis.map((n) => String(n.id))
                                dispatch({ type: "PATCH", payload: { niveis: next } })
                                debouncedSearch({ niveis: next })
                            }}
                        />
                        <div className="flex flex-col gap-1 max-h-52 overflow-y-auto">
                            {props.todosNiveis.map((n) => (
                                <label key={n.id} className="flex items-center gap-2 text-sm cursor-pointer py-0.5">
                                    <input
                                        type="checkbox"
                                        checked={niveis.includes(String(n.id))}
                                        onChange={() => {
                                            const next = toggleItem(niveis, String(n.id))
                                            dispatch({ type: "PATCH", payload: { niveis: next } })
                                            debouncedSearch({ niveis: next })
                                        }}
                                        className="accent-primary"
                                    />
                                    {n.nome}
                                </label>
                            ))}
                        </div>
                        {niveis.length > 0 && (
                            <button
                                type="button"
                                onClick={limparNiveis}
                                className="mt-2 w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                            >
                                Limpar níveis
                            </button>
                        )}
                    </FilterDropdown>

                    <FilterDropdown label={modalidadeLabel} active={modalidade !== "todos"} loading={loading}>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Modalidade</p>
                        {MODALIDADE_OPTIONS.map((opt) => (
                            <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer py-0.5">
                                <input
                                    type="radio"
                                    name="modalidade"
                                    value={opt.value}
                                    checked={modalidade === opt.value}
                                    onChange={() => {
                                        dispatch({ type: "PATCH", payload: { modalidade: opt.value } })
                                        triggerSearch({ modalidade: opt.value })
                                    }}
                                    className="accent-primary"
                                />
                                {opt.label}
                            </label>
                        ))}
                    </FilterDropdown>

                    <FilterDropdown
                        label={precoLabel}
                        active={precoMax !== ""}
                        loading={loading}
                        onClose={() => {
                            if (precoMax !== precoUltimoSubmit.current) {
                                precoUltimoSubmit.current = precoMax
                                triggerSearch({ precoMax })
                            }
                        }}
                    >
                        <p className="text-xs font-medium text-muted-foreground mb-2">Preço máximo por hora</p>
                        <input
                            type="text"
                            value={precoMax}
                            onChange={(e) => dispatch({ type: "PATCH", payload: { precoMax: e.target.value.replace(/[^0-9.,]/g, "") } })}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (precoMax !== precoUltimoSubmit.current) {
                                        precoUltimoSubmit.current = precoMax
                                        triggerSearch({ precoMax })
                                    }
                                }
                            }}
                            placeholder="R$ 0,00"
                            className="field-default w-full h-9 text-sm px-3"
                            aria-label="Preço máximo por hora"
                        />
                    </FilterDropdown>

                    <FilterDropdown
                        label={cidadeLabel}
                        active={cidade !== ""}
                        loading={loading}
                        onClose={() => {
                            if (cidade !== cidadeUltimoSubmit.current) {
                                cidadeUltimoSubmit.current = cidade
                                triggerSearch({ cidade })
                            }
                        }}
                    >
                        <p className="text-xs font-medium text-muted-foreground mb-2">Cidade</p>
                        <input
                            type="text"
                            value={cidade}
                            onChange={(e) => dispatch({ type: "PATCH", payload: { cidade: e.target.value } })}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (cidade !== cidadeUltimoSubmit.current) {
                                        cidadeUltimoSubmit.current = cidade
                                        triggerSearch({ cidade })
                                    }
                                }
                            }}
                            placeholder="Ex: São Paulo"
                            className="field-default w-full h-9 text-sm px-3"
                            aria-label="Filtrar por cidade"
                        />
                    </FilterDropdown>

                    <FilterDropdown
                        label={disponibilidadeLabel}
                        active={dias.length > 0 || horaInicio !== "" || horaFim !== ""}
                        loading={loading}
                        onOpen={sincronizarDisponibilidade}
                        className="w-80 max-w-[calc(100vw-2rem)]"
                    >
                        <p className="text-xs font-medium text-muted-foreground mb-3">Disponibilidade</p>
                        
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                    Dias
                                </span>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {DIAS_SEMANA.map((d) => (
                                        <button
                                            key={d.value}
                                            type="button"
                                            onClick={() => setDispDias(toggleItem(dispDias, d.value))}
                                            aria-pressed={dispDias.includes(d.value)}
                                            className={`text-xs h-7 rounded-md border transition-colors ${
                                                dispDias.includes(d.value)
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "border-border hover:border-foreground/40"
                                            }`}
                                        >
                                            {d.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                    Horas
                                </span>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={dispInicio}
                                        onChange={(e) => setDispInicio(e.target.value)}
                                        className="field-default flex-1 min-w-0 text-xs px-2"
                                        aria-label="Hora de início"
                                    >
                                        <option value="">―</option>
                                        {HORAS.map((h) => (
                                            <option key={h} value={`${String(h).padStart(2, "0")}:00`}>
                                                {String(h).padStart(2, "0")}:00
                                            </option>
                                        ))}
                                    </select>
                                    <span className="text-xs text-muted-foreground shrink-0">até</span>
                                    <select
                                        value={dispFim}
                                        onChange={(e) => setDispFim(e.target.value)}
                                        className="field-default flex-1 min-w-0 text-xs px-2"
                                        aria-label="Hora de fim"
                                    >
                                        <option value="">―</option>
                                        {HORAS.map((h) => (
                                            <option key={h} value={`${String(h).padStart(2, "0")}:00`}>
                                                {String(h).padStart(2, "0")}:00
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                            <button
                                type="button"
                                onClick={redefinirDisponibilidade}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Redefinir
                            </button>
                            <button
                                type="button"
                                onClick={aplicarDisponibilidade}
                                className="text-xs h-8 py-2 px-4 rounded-full bg-primary text-primary-foreground font-medium hover:brightness-110 transition-all"
                            >
                                Aplicar
                            </button>
                        </div>
                    </FilterDropdown>

                    {hasFilters && (
                        <button
                            type="button"
                            onClick={limparFiltros}
                            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0"
                        >
                            <FaTimes className="w-2.5 h-2.5" aria-hidden="true" />
                            Limpar{activeFilterCount > 0 && ` (${activeFilterCount})`}
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

                {erro && (
                    <EmptyState
                        message="Erro ao carregar resultados."
                        action={{ label: "Tentar novamente", onClick: () => window.location.reload() }}
                        compact
                    />
                )}

                {semTutores && (
                    <EmptyState message="Nenhum tutor cadastrado no momento." />
                )}

                {semResultados && (
                    <EmptyState
                        message="Nenhum tutor encontrado com esses filtros."
                        action={{ label: "Limpar filtros", onClick: limparFiltros }}
                        compact
                    />
                )}

                {mostrarTutores && (
                    <div className="hidden lg:flex items-center justify-between">
                        <p className="text-sm text-muted-foreground tabular-nums">
                            {data.total} tutor{data.total !== 1 ? "es" : ""} encontrado{data.total !== 1 ? "s" : ""}
                        </p>
                        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={handlePageChange} compact />
                    </div>
                )}

                {loading && (
                    <div className="grid sm:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }, (_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}

                {mostrarTutores && (
                    <>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {data.tutores.map((tutor) => (
                                <TutorCard key={tutor.userId} tutor={tutor} />
                            ))}
                        </div>
                        <Pagination
                            page={data.page}
                            totalPages={data.totalPages}
                            total={data.total}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    )
}
