import Link from "next/link";
import { FaAngleLeft, FaBookOpen, FaGraduationCap } from "react-icons/fa";

export default function EscolherPerfilPage() {

    return (
        <main className="bg-background min-h-screen flex flex-col items-center p-2">

            <section className="w-full max-w-5xl flex flex-col items-center mt-12">    
                <Link href="/" className="self-start flex items-center gap-1 text-primary mb-6">
                    <FaAngleLeft className="text-xl" /> 
                    <p className="text-sm">Retornar</p>
                </Link>

                <div className="mb-12 text-center">
                    <p className="text-3xl sm:text-5xl font-bold text-primary tracking-tight">
                        Olá, seja bem-vindo!
                    </p>
                    <p className="text-2xl sm:text-3xl font-semibold text-foreground mt-2">
                        Para começar, nos diga o que você está procurando:
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
                    <Link href="/cadastro/aluno" className="group flex-1 flex gap-4 flex-col items-center shadow text-muted-foreground text-center border border-border rounded-lg p-4 hover:border-primary transition">
                        <h2 className="text-lg font-semibold text-primary">Quero Aprender</h2>
                        <FaBookOpen className="bg-secondary h-16 w-16 p-4 text-primary rounded-lg group-hover:text-secondary group-hover:bg-primary" />
                        <p className="text mt-2">
                            Quero encontrar um tutor para me ajudar a aprender.
                        </p>
                    </Link>
                    
                    <Link href="/cadastro/tutor" className="group flex-1 flex gap-4 flex-col items-center shadow text-muted-foreground text-center border border-border rounded-lg p-4 hover:border-primary transition">
                        <h2 className="text-lg font-semibold text-primary">Quero Ensinar</h2>
                        <FaGraduationCap className="bg-secondary h-16 w-16 p-4 text-primary rounded-lg group-hover:text-secondary group-hover:bg-primary" />
                        <p className="text mt-1">
                            Cadastre-se como tutor e conecte-se com alunos
                        </p>
                    </Link>
                </div>

                <p className="text-sm text-foreground/80 mt-6 text-center flex flex-col items-center">
                    <span>Tem uma conta?</span>
                    <Link href="/login" className="text-primary hover:underline">Entrar</Link>
                </p>
            </section>
        </main>
    )
}