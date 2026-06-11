import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { buscarTutores } from "@/lib/buscar-tutores"

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams

  const result = await buscarTutores({
    q: searchParams.get("q") || undefined,
    materias: searchParams.get("materias")?.split(",").filter(Boolean).map(Number) || undefined,
    niveis: searchParams.get("niveis")?.split(",").filter(Boolean).map(Number) || undefined,
    modalidade: searchParams.get("modalidade") || undefined,
    voluntario: searchParams.get("voluntario") === "true" || undefined,
    precoMax: searchParams.get("precoMax") || undefined,
    cidade: searchParams.get("cidade") || undefined,
    dias: searchParams.get("dias")?.split(",").filter(Boolean).map(Number) || undefined,
    horaInicio: searchParams.get("horaInicio") || undefined,
    horaFim: searchParams.get("horaFim") || undefined,
    page: Math.max(1, parseInt(searchParams.get("page") || "1") || 1),
    pageSize: Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "8"))),
  })

  return NextResponse.json(result)
}
