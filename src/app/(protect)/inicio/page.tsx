import { auth } from "@/lib/auth"
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";



export default async function InicioPage() {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/login")
    }

    return (
        <main>
            <h1>Olá, {session.user.name}!</h1>
            <Link href={`/perfil`}>Editar Perfil</Link>
        </main>
    )
}