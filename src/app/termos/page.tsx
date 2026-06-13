import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Termos de Uso — Tutoria",
  description: "Termos e condições para uso da plataforma Tutoria de conexão entre alunos e tutores.",
}

function FooterSection() {
  return (
    <footer className="bg-foreground text-white/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <span className="text-2xl font-semibold tracking-tight text-white">tutoria</span>
            <p className="mt-2 text-sm leading-relaxed max-w-[35ch]">
              A plataforma que conecta alunos e tutores de forma simples, rápida e confiável.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/80 mb-3">Navegação</p>
            <Link href="/" className="block text-sm hover:text-white transition-colors">Página inicial</Link>
            <Link href="/buscar" className="block text-sm hover:text-white transition-colors">Buscar tutores</Link>
            <Link href="/cadastro" className="block text-sm hover:text-white transition-colors">Criar conta</Link>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/80 mb-3">Legal</p>
            <Link href="/privacidade" className="block text-sm hover:text-white transition-colors">Política de Privacidade</Link>
            <Link href="/termos" className="block text-sm hover:text-white transition-colors">Termos de Uso</Link>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} Tutoria. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

const sections = [
  {
    id: "aviso",
    title: null,
    content: (
      <div className="bg-surface rounded-xl p-5 border border-border text-sm">
        <p className="text-ink font-medium mb-1">Projeto de portfólio</p>
        <p className="text-muted-foreground">
          A Tutoria é um projeto pessoal de portfólio, não um serviço comercial em operação.
          Recomendamos que não insira dados pessoais reais ao testar a plataforma. Os dados
          fornecidos durante os testes podem ser excluídos a qualquer momento entrando em
          contato pelo e-mail ao final destes termos.
        </p>
      </div>
    ),
  },
  {
    id: "aceitacao",
    title: "Aceitação dos termos",
    content: (
      <p>
        Ao criar uma conta ou utilizar a plataforma Tutoria, você declara ter lido, compreendido
        e aceitado estes Termos de Uso. Caso não concorde com qualquer condição aqui estabelecida,
        não utilize a plataforma.
      </p>
    ),
  },
  {
    id: "definicoes",
    title: "Definições",
    content: (
      <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
        <li>
          <strong>Plataforma:</strong> site Tutoria, acessível em tutoria.com.br, que conecta alunos
          a tutores particulares.
        </li>
        <li>
          <strong>Aluno:</strong> usuário que busca contratar serviços de tutoria.
        </li>
        <li>
          <strong>Tutor:</strong> profissional que oferece serviços educacionais por meio da
          plataforma.
        </li>
        <li>
          <strong>Conteúdo:</strong> informações, textos, imagens e demais materiais inseridos
          por usuários na plataforma.
        </li>
      </ul>
    ),
  },
  {
    id: "servico",
    title: "Descrição do serviço",
    content: (
      <div className="space-y-4">
        <p>
          A Tutoria é uma plataforma de intermediação que conecta alunos a tutores particulares.
          A plataforma exibe perfis de tutores com informações como matérias, níveis de ensino,
          preços, localização e disponibilidade, permitindo que alunos encontrem o profissional
          mais adequado às suas necessidades.
        </p>
        <div className="bg-surface rounded-xl p-5 border border-border">
          <p className="text-sm font-semibold text-ink mb-1">A Tutoria não é parte da relação de ensino</p>
          <p className="text-sm text-muted-foreground">
            A plataforma atua exclusivamente como meio de contato. Os acordos de aulas,
            valores, horários e condições são estabelecidos diretamente entre aluno e tutor.
            A Tutoria não se responsabiliza pela qualidade, pontualidade ou conteúdo das aulas
            ministradas.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "contas",
    title: "Contas de usuário",
    content: (
      <div className="space-y-4">
        <div>
          <strong className="text-ink">Criação de conta:</strong>
          <p className="text-muted-foreground mt-1">
            Para utilizar a plataforma, é necessário criar uma conta com nome, e-mail e senha,
            ou através de autenticação via Google. Você é responsável por manter a
            confidencialidade dos seus dados de acesso.
          </p>
        </div>
        <div>
          <strong className="text-ink">Verificação de e-mail:</strong>
          <p className="text-muted-foreground mt-1">
            Exigimos a verificação do endereço de e-mail para ativação da conta.
          </p>
        </div>
        <div>
          <strong className="text-ink">Precisão das informações:</strong>
          <p className="text-muted-foreground mt-1">
            Você se compromete a fornecer informações verdadeiras, atualizadas e completas
            durante o cadastro e uso da plataforma.
          </p>
        </div>
        <div>
          <strong className="text-ink">Uma conta por pessoa:</strong>
          <p className="text-muted-foreground mt-1">
            Cada pessoa física pode ter apenas uma conta. Contas duplicadas podem ser removidas.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "tutores",
    title: "Responsabilidades do tutor",
    content: (
      <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
        <li>Manter as informações do perfil precisas e atualizadas</li>
        <li>Respeitar os preços e condições anunciados no perfil</li>
        <li>Cumprir os horários e aulas agendadas com os alunos</li>
        <li>Não utilizar a plataforma para oferecer serviços fora do escopo educacional</li>
        <li>Não solicitar pagamentos fora dos canais acordados com o aluno de forma fraudulenta</li>
        <li>Responder aos contatos dos alunos de forma profissional e dentro de prazo razoável</li>
        <li>
          A Tutoria não cobra taxas dos tutores pelo cadastro ou pela exposição do perfil.
          Não há planos de assinatura ou comissão sobre aulas.
        </li>
      </ul>
    ),
  },
  {
    id: "alunos",
    title: "Responsabilidades do aluno",
    content: (
      <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
        <li>Fornecer informações verdadeiras ao criar sua conta</li>
        <li>Respeitar os horários, preços e condições estabelecidos pelos tutores</li>
        <li>Comunicar-se de forma respeitosa e profissional com os tutores</li>
        <li>Não utilizar a plataforma para fins fraudulentos ou abusivos</li>
      </ul>
    ),
  },
  {
    id: "conduta-proibida",
    title: "Conduta proibida",
  content: (
    <div className="space-y-2">
      <p className="text-muted-foreground">
        É expressamente proibido utilizar a plataforma para:
      </p>
      <ul className="space-y-1 list-disc pl-5 text-muted-foreground">
        <li>Fornecer informações falsas ou fraudulentas</li>
        <li>Assediar, discriminar ou ameaçar outros usuários</li>
        <li>Utilizar a plataforma para fins ilegais ou não autorizados</li>
        <li>Tentar acessar dados de outros usuários sem autorização</li>
        <li>Realizar spam ou contatos não solicitados</li>
        <li>Burbar sistemas de segurança ou autenticação da plataforma</li>
        <li>Copiar, reproduzir ou distribuir conteúdo da plataforma sem autorização</li>
      </ul>
    </div>
  ),
  },
  {
    id: "lgpd",
    title: "Proteção de dados",
    content: (
      <p>
        O tratamento dos seus dados pessoais é regido pela nossa{" "}
        <Link href="/privacidade" className="text-primary underline hover:no-underline">
          Política de Privacidade
        </Link>
        , que integra estes Termos de Uso. Ao utilizar a plataforma, você declara estar ciente
        das práticas descritas na política.
      </p>
    ),
  },
  {
    id: "propriedade-intelectual",
    title: "Propriedade intelectual",
    content: (
      <div className="space-y-2">
        <p>
          A plataforma Tutoria, incluindo seu nome, logotipo, design, código-fonte e conteúdo
          original, é propriedade da Tutoria.
        </p>
        <p>
          Ao publicar conteúdo na plataforma (descrições, fotos, etc.), você concede à Tutoria
          uma licença não exclusiva, gratuita e mundial para exibir tal conteúdo exclusivamente
          no contexto da plataforma.
        </p>
      </div>
    ),
  },
  {
    id: "limitacao-responsabilidade",
    title: "Limitação de responsabilidade",
    content: (
      <div className="space-y-4">
        <p>
          A Tutoria atua como plataforma de intermediação e não se responsabiliza por:
        </p>
        <ul className="space-y-1 list-disc pl-5 text-muted-foreground">
          <li>A qualidade, conteúdo ou pontualidade das aulas ministradas</li>
          <li>Acordos financeiros firmados diretamente entre aluno e tutor</li>
          <li>Condutas de usuários dentro ou fora da plataforma</li>
          <li>Danos decorrentes de uso inadequado da plataforma</li>
          <li>Interrupções temporárias do serviço para manutenção ou por motivos técnicos</li>
        </ul>
        <p className="mt-2">
          A plataforma é oferecida "como está", sem garantias de disponibilidade ininterrupta
          ou ausência de erros.
        </p>
      </div>
    ),
  },
  {
    id: "suspensao-exclusao",
    title: "Suspensão e exclusão de conta",
    content: (
      <div className="space-y-2">
        <p>
          Você pode excluir sua conta a qualquer momento pelas configurações do perfil. A exclusão
          é irreversível e remove todos os dados associados.
        </p>
        <p>
          A Tutoria pode suspender ou encerrar contas que violem estes Termos de Uso, sem prejuízo
          de outras medidas legais cabíveis. Em caso de violação grave, a plataforma pode remover
          conteúdo ou bloquear o acesso sem aviso prévio.
        </p>
      </div>
    ),
  },
  {
    id: "alteracoes-termos",
    title: "Alterações dos Termos de Uso",
    content: (
      <p>
        Estes termos podem ser alterados a qualquer momento para refletir mudanças na plataforma
        ou na legislação. Recomendamos a revisão periódica deste documento. Em caso de alterações
        materiais, os usuários serão notificados por e-mail ou por aviso na plataforma.
        O uso continuado após as alterações constitui aceitação dos novos termos.
      </p>
    ),
  },
  {
    id: "lei-aplicavel",
    title: "Lei aplicável e foro",
    content: (
      <p>
        Estes Termos de Uso são regidos pela legislação brasileira.
      </p>
    ),
  },
  {
    id: "contato-termos",
    title: "Contato",
    content: (
      <div className="space-y-1">
        <p>
          Em caso de dúvidas sobre estes Termos de Uso, entre em contato pelo e-mail{" "}
          <a href={`mailto:${process.env.EMAIL_FROM}`} className="text-primary underline hover:no-underline">
            {process.env.EMAIL_FROM}
          </a>.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          <em>Última atualização: junho de 2026.</em>
        </p>
      </div>
    ),
  },
]

export default function TermosPage() {
  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-tight text-balance">
            Termos de Uso
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed max-w-prose text-primary-foreground/85">
            Condições gerais para utilização da plataforma Tutoria de conexão entre alunos e tutores particulares.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="space-y-10">
            {sections.map((section) => (
              <article key={section.id} id={section.id}>
                {section.title && (
                  <h2 className="text-xl sm:text-2xl font-semibold leading-tight text-ink mb-3">
                    {section.title}
                  </h2>
                )}
                <div className="text-[0.9375rem] leading-relaxed text-muted-foreground space-y-2">
                  {section.content}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </>
  )
}
