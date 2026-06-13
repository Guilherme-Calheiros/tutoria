import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Política de Privacidade — Tutoria",
  description: "Saiba como a Tutoria coleta, usa e protege seus dados pessoais em conformidade com a LGPD.",
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
          contato pelo e-mail abaixo.
        </p>
      </div>
    ),
  },
  {
    id: "quem-somos",
    title: "Quem somos",
    content: (
      <p>
        A Tutoria é uma plataforma brasileira que conecta alunos a tutores particulares.
        Sua privacidade é importante para nós. Esta Política de Privacidade explica como
        coletamos, usamos, armazenamos e protegemos seus dados pessoais, em conformidade
        com a Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018).
      </p>
    ),
  },
  {
    id: "dados-coletados",
    title: "Dados que coletamos",
    content: (
      <div className="space-y-4">
        <p>Coletamos apenas os dados necessários para o funcionamento da plataforma:</p>
        <div>
          <strong className="text-ink">Cadastro (obrigatório):</strong>
          <ul className="mt-1 space-y-1 list-disc pl-5 text-muted-foreground">
            <li>Nome completo</li>
            <li>Endereço de e-mail</li>
            <li>Senha (armazenada de forma criptografada pelo Better Auth)</li>
            <li>Tipo de perfil (aluno ou tutor)</li>
          </ul>
        </div>
        <div>
          <strong className="text-ink">Cadastro com Google (alternativa):</strong>
          <ul className="mt-1 space-y-1 list-disc pl-5 text-muted-foreground">
            <li>Nome, e-mail e foto de perfil fornecidos pelo Google</li>
            <li>Tokens de acesso OAuth (armazenados para gerenciar a autenticação)</li>
          </ul>
        </div>
        <div>
          <strong className="text-ink">Perfil do tutor (opcional para tutores):</strong>
          <ul className="mt-1 space-y-1 list-disc pl-5 text-muted-foreground">
            <li>Número de telefone (exibido para alunos como contato via WhatsApp)</li>
            <li>Foto de perfil (armazenada no Cloudflare R2)</li>
            <li>Descrição profissional e biografia</li>
            <li>Modalidade de ensino (presencial, EAD ou ambos)</li>
            <li>Disponibilidade de horários (dias da semana e horários)</li>
            <li>Bairro, cidade e estado de atendimento</li>
            <li>Valor da hora aula</li>
            <li>Indicação se atende turmas e/ou alunos individuais</li>
            <li>Indicação se atende como voluntário</li>
            <li>Matérias e níveis de ensino selecionados</li>
          </ul>
        </div>
        <div>
          <strong className="text-ink">Coleta automática (sessão):</strong>
          <ul className="mt-1 space-y-1 list-disc pl-5 text-muted-foreground">
            <li>Endereço IP</li>
            <li>Agente do navegador (user-agent)</li>
            <li>Token de sessão (para manter você autenticado)</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "uso-dados",
    title: "Como usamos seus dados",
    content: (
      <div className="space-y-4">
        <div className="space-y-2">
          <p>Utilizamos seus dados para as seguintes finalidades e bases legais:</p>
          <ul className="space-y-2 pl-5 text-muted-foreground">
            <li className="list-disc">
              <strong>Operação da plataforma, exibição de perfis e contato entre usuários</strong>
              <br />
              <span className="text-xs text-muted-foreground/70">Base legal: execução do contrato (Art. 7º, V, LGPD)</span>
            </li>
            <li className="list-disc">
              <strong>Envio de e-mails transacionais</strong> (verificação de conta, redefinição de senha, confirmação de exclusão)
              <br />
              <span className="text-xs text-muted-foreground/70">Base legal: execução do contrato (Art. 7º, V) e obrigação legal (Art. 7º, II, LGPD)</span>
            </li>
            <li className="list-disc">
              <strong>Melhoria da experiência da plataforma</strong>
              <br />
              <span className="text-xs text-muted-foreground/70">Base legal: legítimo interesse (Art. 7º, IX, LGPD)</span>
            </li>
            <li className="list-disc">
              <strong>Cumprimento de obrigações legais e regulatórias</strong>
              <br />
              <span className="text-xs text-muted-foreground/70">Base legal: obrigação legal (Art. 7º, II, LGPD)</span>
            </li>
            <li className="list-disc">
              <strong>Dados opcionais do perfil do tutor</strong> (foto, descrição, endereços, disponibilidade)
              <br />
              <span className="text-xs text-muted-foreground/70">Base legal: consentimento (Art. 7º, I, LGPD)</span>
            </li>
          </ul>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-border text-sm">
          <p className="text-ink font-medium mb-1">O fornecimento dos dados de cadastro é condição para uso da plataforma</p>
          <p className="text-muted-foreground">
            Sem os dados obrigatórios (nome, e-mail e senha), não é possível criar sua conta
            e utilizar a Tutoria. Já os dados opcionais do perfil do tutor podem ser fornecidos
            livremente e podem ser removidos a qualquer momento.
          </p>
        </div>
        <p>
          <strong>Não utilizamos seus dados para:</strong> publicidade direcionada, criação de
          perfis comportamentais, venda a terceiros ou qualquer finalidade não descrita nesta
          política.
        </p>
      </div>
    ),
  },
  {
    id: "compartilhamento",
    title: "Compartilhamento de dados",
    content: (
      <div className="space-y-2">
        <p>A Tutoria compartilha seus dados apenas com prestadores de serviço essenciais para o funcionamento da plataforma:</p>
        <ul className="space-y-1 list-disc pl-5 text-muted-foreground">
          <li>
            <strong>Neon (PostgreSQL via AWS São Paulo):</strong> armazenamento de todos os dados da plataforma.
            Os servidores estão localizados na região Sul da América do Sul (AWS sa-east-1).
          </li>
          <li>
            <strong>Cloudflare R2:</strong> armazenamento de fotos de perfil dos usuários.
          </li>
          <li>
            <strong>Resend:</strong> envio de e-mails transacionais (verificação de conta, redefinição de senha, confirmação de exclusão).
          </li>
          <li>
            <strong>Google:</strong> autenticação via OAuth (apenas se você optar por entrar com Google).
          </li>
        </ul>
        <p className="mt-2">
          Não compartilhamos dados com redes de publicidade, corretores de dados ou qualquer
          outra entidade não listada acima.
        </p>
      </div>
    ),
  },
  {
    id: "armazenamento-seguranca",
    title: "Armazenamento e segurança",
    content: (
      <div className="space-y-2">
        <p>Adotamos medidas técnicas e organizacionais para proteger seus dados:</p>
        <ul className="space-y-1 list-disc pl-5 text-muted-foreground">
          <li>Criptografia de senhas (hash seguro via Better Auth)</li>
          <li>Conexão HTTPS em toda a plataforma</li>
          <li>Validação de sessão em todas as requisições autenticadas</li>
          <li>Armazenamento de imagens em infraestrutura segura (Cloudflare R2)</li>
          <li>Banco de dados em provedor com certificações de segurança (Neon/AWS)</li>
          <li>Controle de acesso rigoroso: cada usuário só pode modificar seus próprios dados</li>
        </ul>
        <div className="bg-surface rounded-xl p-4 border border-border text-sm mt-4">
          <p className="text-ink font-medium mb-1">Comunicação de incidentes</p>
          <p className="text-muted-foreground">
            Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos
            titulares, adotaremos as providências determinadas pelo Art. 48 da LGPD, incluindo
            a comunicação à ANPD e aos titulares afetados no prazo legal.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "retencao-exclusao",
    title: "Retenção e exclusão",
    content: (
      <div className="space-y-2">
        <p>
          Seus dados são mantidos enquanto sua conta estiver ativa. Você pode solicitar a exclusão
          da sua conta a qualquer momento pelas configurações do perfil, e todos os dados associados
          serão removidos permanentemente, incluindo:
        </p>
        <ul className="space-y-1 list-disc pl-5 text-muted-foreground">
          <li>Informações cadastrais (nome, e-mail, telefone)</li>
          <li>Perfil de tutor (descrição, matérias, níveis, endereços, disponibilidade)</li>
          <li>Foto de perfil (removida do Cloudflare R2)</li>
          <li>Sessões e tokens de autenticação</li>
        </ul>
        <p className="mt-2">
          A exclusão é irreversível. Para concluir o processo, enviamos um e-mail de confirmação
          para o endereço cadastrado.
        </p>
      </div>
    ),
  },
  {
    id: "direitos-lgpd",
    title: "Seus direitos (LGPD)",
    content: (
      <div className="space-y-3">
        <p>
          Com base na Lei Geral de Proteção de Dados Pessoais (LGPD — Art. 18), você pode,
          a qualquer momento, mediante requisição:
        </p>
        <ul className="space-y-1 list-disc pl-5 text-muted-foreground">
          <li>Confirmar a existência de tratamento dos seus dados</li>
          <li>Acessar seus dados pessoais</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
          <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a lei</li>
          <li>Solicitar a portabilidade dos dados a outro fornecedor de serviço ou produto</li>
          <li>Eliminar dados pessoais tratados com seu consentimento</li>
          <li>Ser informado sobre entidades públicas e privadas com as quais compartilhamos dados</li>
          <li>Ser informado sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa</li>
          <li>Revogar o consentimento a qualquer tempo</li>
        </ul>
        <p className="mt-3">
          Você também tem o direito de peticionar contra o controlador perante a Autoridade
          Nacional de Proteção de Dados (ANPD), bem como solicitar a revisão de decisões
          tomadas exclusivamente com base em tratamento automatizado de dados (Art. 20, LGPD).
        </p>
        <p>
          Para exercer seus direitos, entre em contato pelo e-mail indicado no final desta
          política. Responderemos em até 15 dias úteis, nos termos do Art. 19 da LGPD.
        </p>
      </div>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    content: (
      <div className="space-y-2">
        <p>
          A Tutoria utiliza cookies estritamente necessários para o funcionamento da plataforma:
        </p>
        <ul className="space-y-1 list-disc pl-5 text-muted-foreground">
          <li>
            <strong>Cookies de sessão:</strong> mantêm você autenticado durante a navegação.
            Gerenciados pelo Better Auth, são essenciais para o funcionamento da plataforma.
          </li>
        </ul>
        <p className="mt-2">
          <strong>Não utilizamos</strong> cookies de rastreamento, publicidade, analytics ou
          qualquer outro tipo de cookie não essencial. Não há scripts de terceiros para coleta
          de dados de navegação.
        </p>
      </div>
    ),
  },
  {
    id: "transferencias",
    title: "Transferências internacionais",
    content: (
      <p>
        Seus dados são armazenados em servidores localizados no Brasil (AWS São Paulo, via Neon).
        Imagens de perfil são armazenadas na rede global do Cloudflare R2. Ao utilizar a opção
        de login com Google, seus dados são processados de acordo com a política de privacidade
        do Google. Adotamos salvaguardas contratuais adequadas para garantir a proteção dos seus
        dados conforme a LGPD.
      </p>
    ),
  },
  {
    id: "menores",
    title: "Menores de idade",
    content: (
      <p>
        A plataforma é destinada a maiores de 13 anos. Menores entre 13 e 18 anos devem utilizar
        a plataforma com supervisão de um responsável legal. Não coletamos intencionalmente dados
        de crianças menores de 13 anos. Se identificarmos o cadastro de um menor de 13 anos,
        excluiremos a conta e os dados associados.
      </p>
    ),
  },
  {
    id: "alteracoes",
    title: "Alterações nesta política",
    content: (
      <p>
        Esta política pode ser atualizada periodicamente para refletir mudanças na plataforma
        ou na legislação. Recomendamos a revisão periódica deste documento. Alterações materiais
        serão comunicadas por e-mail ou por aviso na plataforma.
      </p>
    ),
  },
  {
    id: "contato",
    title: "Contato e encarregado (DPO)",
    content: (
      <div className="space-y-2">
        <p>
          Em caso de dúvidas sobre esta Política de Privacidade ou para exercer seus direitos
          nos termos da LGPD, entre em contato:
        </p>
        <ul className="space-y-1 text-muted-foreground">
          <li>
            <strong>E-mail:</strong>{" "}
            <a href={`mailto:${process.env.EMAIL_FROM}`} className="text-primary underline hover:no-underline">
              {process.env.EMAIL_FROM}
            </a>
          </li>
        </ul>
        <p className="text-sm text-muted-foreground mt-4">
          <em>Última atualização: junho de 2026.</em>
        </p>
      </div>
    ),
  },
]

export default function PrivacidadePage() {
  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-tight text-balance">
            Política de Privacidade
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed max-w-prose text-primary-foreground/85">
            Saiba como a Tutoria coleta, usa e protege seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD).
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
