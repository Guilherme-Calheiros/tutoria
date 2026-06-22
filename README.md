# Tutoria

Plataforma brasileira de marketplace para conectar alunos a tutores particulares.

## Stack

| Categoria | Tecnologia |
|---|---|
| Framework | **Next.js 16** (App Router) |
| Linguagem | **TypeScript 5** (strict) |
| UI | **React 19** com Server Components |
| Estilização | **Tailwind CSS v4** |
| Banco | **PostgreSQL** via **Neon** (serverless) |
| ORM | **Drizzle ORM** |
| Autenticação | **better-auth** (email/senha, Google OAuth) |
| Formulários | **react-hook-form** + **zod** |
| Email | **Resend** + **react-email** |
| Storage | **Cloudflare R2** (S3-compatível) |

## Scripts

```bash
npm run dev      # next dev
npm run build    # next build
npm run start    # next start
npm run lint     # eslint
npm run seed     # popular matérias e níveis de ensino
```

## Funcionalidades

- Landing page com dados dinâmicos
- Cadastro e login (email/senha + Google OAuth)
- Verificação de email e redefinição de senha
- Onboarding multi-step para tutores
- Dashboard e edição de perfil com seções
- Agenda de disponibilidade (grid visual)
- Busca/filtro de tutores (matéria, nível, modalidade, preço, cidade, disponibilidade)
- Perfil público do tutor com contato via WhatsApp
- Política de Privacidade (LGPD) e Termos de Uso
- Upload de avatar para Cloudflare R2
- Exclusão de conta

## Estrutura

```
src/
├── app/           # Next.js App Router (rotas + componentes)
├── action/        # Server actions
├── lib/           # Utilitários, DB, auth
├── schemas/       # Validação Zod
└── db.ts          # Singleton do banco
```

## Projeto

Este é um projeto privado em estágio inicial (v0.1.0) voltado para o mercado brasileiro de aulas particulares.
