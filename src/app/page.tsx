import { db } from "@/db"
import { materia } from "@/lib/db/schema"
import Image from "next/image"
import Link from "next/link"
import { FaSearch, FaUserPlus, FaGraduationCap, FaArrowRight } from "react-icons/fa"

export default async function Home() {

  const todasMaterias = await db.select().from(materia)

  return (
    <>
      <HeroSection />
      <ComoFuncionaSection />
      <MateriasSection todasMaterias={todasMaterias} />
      <ParaTutoresSection />
      <CTAFinalSection />
      <FooterSection />
    </>
  )
}

function HeroSection() {
  return (
    <section className="border-b border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="md:grid md:grid-cols-2 md:gap-12 lg:gap-16 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.1] text-ink text-balance">
              Encontre o tutor ideal para você
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl md:max-w-none leading-relaxed">
              Milhares de tutores em diversas matérias e níveis de ensino. Aulas
              online ou presenciais, do fundamental ao vestibular.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4">
              <Link
                href="/cadastro/aluno"
                className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold rounded-lg px-8 py-3.5 text-base hover:opacity-90 transition-opacity min-w-50"
              >
                Quero aprender
              </Link>
              <Link
                href="/cadastro/tutor"
                className="inline-flex items-center justify-center border-2 border-border text-foreground font-semibold rounded-lg px-8 py-3.5 text-base hover:border-foreground/30 transition-colors min-w-50"
              >
                Quero ensinar
              </Link>
            </div>
          </div>
          <div className="mt-12 md:mt-0 flex justify-center md:justify-end">
            <Image
              src="/teacher.svg"
              alt="Professora em reunião no computador"
              width={480}
              height={347}
              className="w-full max-w-md h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function ComoFuncionaSection() {
  const passos = [
    {
      titulo: "Encontre",
      descricao:
        "Busque por matéria, nível de ensino e localização. Filtre tutores que atendem exatamente ao que você precisa.",
    },
    {
      titulo: "Conecte-se",
      descricao:
        "Veja perfis completos com descrição, formação e áreas de atuação. Escolha o tutor ideal para você.",
    },
    {
      titulo: "Aprenda",
      descricao:
        "Combine aulas, defina horários e comece a aprender no seu ritmo. Acompanhe seu progresso ao longo do tempo.",
    },
  ]

  return (
    <section className="bg-primary text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h2 className="text-[clamp(1.25rem,2vw,1.75rem)] font-semibold leading-[1.3] text-balance text-center">
          Como funciona
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8 sm:gap-12">
          {passos.map((passo, i) => (
            <div key={passo.titulo} className="text-center">
              <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center mx-auto">
                {i === 0 ? <FaSearch className="w-6 h-6" /> : i === 1 ? <FaUserPlus className="w-6 h-6" /> : <FaGraduationCap className="w-6 h-6" />}
              </div>
              <h3 className="mt-5 text-xl font-semibold">{passo.titulo}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/70 max-w-[30ch] mx-auto">
                {passo.descricao}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MateriasSection({ todasMaterias }: { todasMaterias: { id: number; nome: string; }[] }) {
  return (
    <section>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h2 className="text-[clamp(1.25rem,2vw,1.75rem)] font-semibold leading-[1.3] text-ink text-balance text-center">
          Matérias populares
        </h2>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {todasMaterias.map((m) => (
            <Link
              key={m.id}
              href={`/buscar?materias=${m.id}`}
              className="flex items-center justify-center rounded-xl bg-surface border border-border px-4 py-6 sm:py-8 text-sm sm:text-base font-medium text-ink hover:border-primary/30 hover:bg-primary/3 hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              {m.nome}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function ParaTutoresSection() {
  const beneficios = [
    "Defina seus próprios horários e valores",
    "Atenda online ou presencial, como preferir",
    "Perfil completo com descrição e áreas de atuação",
    "Acompanhamento de alunos e agendamentos",
  ]

  return (
    <section className="bg-primary text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[clamp(1.25rem,2vw,1.75rem)] font-semibold leading-[1.3] text-balance">
            Compartilhe seu conhecimento
          </h2>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-white/70 max-w-[55ch] mx-auto">
            Milhares de alunos buscam tutores todos os dias. Cadastre-se,
            monte seu perfil e comece a dar aulas quando e onde quiser.
          </p>
          <ul className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-x-8 gap-y-3">
            {beneficios.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
          <Link
            href="/cadastro/tutor"
            className="mt-8 inline-flex items-center justify-center bg-white text-primary font-semibold rounded-lg px-8 py-3.5 text-base hover:opacity-90 transition-opacity"
          >
            Quero dar aulas
          </Link>
        </div>
      </div>
    </section>
  )
}

function CTAFinalSection() {
  return (
    <section>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-[1.2] text-ink text-balance">
          Pronto para começar?
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link
            href="/cadastro/aluno"
            className="flex flex-col items-center gap-2 rounded-2xl bg-surface border-2 border-primary/20 px-8 py-8 text-ink hover:border-primary/40 hover:bg-primary/3 transition-all"
          >
            <span className="text-xl font-bold">Sou aluno</span>
            <span className="text-sm text-muted-foreground">
              Encontre o tutor perfeito para você
            </span>
            <span className="mt-2 text-sm font-medium text-primary inline-flex items-center gap-1">
              Começar agora <FaArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
          <Link
            href="/cadastro/tutor"
            className="flex flex-col items-center gap-2 rounded-2xl bg-surface border border-border px-8 py-8 text-ink hover:border-primary/20 hover:bg-primary/2 transition-all"
          >
            <span className="text-xl font-bold">Sou tutor</span>
            <span className="text-sm text-muted-foreground">
              Compartilhe seu conhecimento
            </span>
            <span className="mt-2 text-sm font-medium text-foreground inline-flex items-center gap-1">
              Cadastrar como tutor <FaArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

function FooterSection() {
  return (
    <footer className="bg-foreground text-white/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <span className="text-2xl font-semibold tracking-tight text-white">Tutoria</span>
            <p className="mt-2 text-sm leading-relaxed max-w-[35ch]">
              A plataforma que conecta alunos e tutores de forma simples, rápida e confiável.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/80 mb-3">Para alunos</p>
            <div className="flex flex-col gap-2">
              <Link href="/cadastro" className="text-sm hover:text-white transition-colors">
                Encontrar tutor
              </Link>
              <Link href="/buscar" className="text-sm hover:text-white transition-colors">
                Matérias disponíveis
              </Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/80 mb-3">Para tutores</p>
            <div className="flex flex-col gap-2">
              <Link href="/cadastro/tutor" className="text-sm hover:text-white transition-colors">
                Cadastrar como tutor
              </Link>
              <Link href="/login" className="text-sm hover:text-white transition-colors">
                Acessar conta
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} Tutoria. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacidade" className="hover:text-white transition-colors">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-white transition-colors">
              Termos de uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
