import Link from "next/link";
import { FaAngleLeft, FaBookOpen, FaGraduationCap } from "react-icons/fa";

export default function EscolherPerfilPage() {

    return (
        <main className="bg-background min-h-screen flex flex-col items-center p-2">

            <section className="w-full max-w-5xl flex flex-col items-center">    
                <Link href="/" className="self-start flex items-center gap-1 text-primary min-h-11">
                    <FaAngleLeft className="text-xl" /> 
                    <span className="text-sm">Retornar</span>
                </Link>

                <div className="mb-12 text-center">
                    <h1 className="text-3xl sm:text-5xl font-bold text-primary tracking-tight">
                        Olá, seja bem-vindo!
                    </h1>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mt-2">
                        Para começar, nos diga o que você está procurando:
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
                    <Link href="/cadastro/aluno" className="group flex-1 flex gap-4 flex-col items-center text-muted-foreground text-center border border-border rounded-lg p-4 hover:border-primary transition">
                        <h2 className="text-lg font-semibold text-primary">Quero Aprender</h2>
                        <FaBookOpen className="bg-secondary h-16 w-16 p-4 text-primary rounded-lg group-hover:text-secondary group-hover:bg-primary" />
                        <p className="text-sm mt-2">
                            Quero encontrar um tutor para me ajudar a aprender.
                        </p>
                    </Link>
                    
                    <Link href="/cadastro/tutor" className="group flex-1 flex gap-4 flex-col items-center text-muted-foreground text-center border border-border rounded-lg p-4 hover:border-primary transition">
                        <h2 className="text-lg font-semibold text-primary">Quero Ensinar</h2>
                        <FaGraduationCap className="bg-secondary h-16 w-16 p-4 text-primary rounded-lg group-hover:text-secondary group-hover:bg-primary" />
                        <p className="text-sm mt-2">
                            Cadastre-se como tutor e conecte-se com alunos
                        </p>
                    </Link>
                </div>

                <p className="text-sm text-muted-foreground mt-6 text-center flex flex-col items-center">
                    <span>Tem uma conta?</span>
                    <Link href="/login" className="text-primary font-medium hover:text-primary/80 transition-colors">Entrar</Link>
                </p>
            </section>
        </main>
    )
}