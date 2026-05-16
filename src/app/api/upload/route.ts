import { auth } from "@/lib/auth";
import { uploadArquivo } from "@/lib/r2/r2";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest){
    try {
        const session = await auth.api.getSession({ headers: await headers() })
        if(!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

        const formData = await request.formData()
        const file = formData.get("file") as File

        if(!file) return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })

        const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"]
        if(!tiposPermitidos.includes(file.type)) return NextResponse.json({ error: "Formato inválido. Use JPG, PNG ou WebP" }, { status: 400 })

        if(file.size > 2 * 1024 * 1024) return NextResponse.json({ error: "Arquivo muito grande. Máximo 2MB" }, { status: 400 })

        const ext = file.name.split(".").pop()
        const nome = `avatars/${session.user.id}-${Date.now()}.${ext}`
        const buffer = Buffer.from(await file.arrayBuffer())

        const url = await uploadArquivo(nome, buffer, file.type)
        return NextResponse.json({ url })
    } catch (err) {
        console.error("Upload error:", err)
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 })
    }
}