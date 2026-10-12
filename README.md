# PipeFlow CRM

CRM multi-empresa para pequenas e médias equipes de vendas: pipeline Kanban visual, gestão de leads e contatos, timeline de atividades, colaboração multi-workspace e cobrança via Stripe.

Spec completa do produto: [docs/PRD.md](docs/PRD.md). Plano de execução (milestones M0–M15): [docs/PLAN.md](docs/PLAN.md). Convenções de código e stack: [CLAUDE.md](CLAUDE.md).

## Stack

Next.js 14 (App Router) + TypeScript + Tailwind/shadcn-ui · Supabase (Postgres, Auth, RLS) · Stripe (Checkout, webhooks, Customer Portal) · Resend (e-mail transacional) · Vercel (deploy).

## Rodando localmente

```bash
npm install
cp .env.local.example .env.local   # preencher com as credenciais de dev
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Variáveis de ambiente necessárias estão documentadas em [.env.local.example](.env.local.example).

## Scripts

```bash
npm run dev         # servidor de desenvolvimento
npm run build       # build de produção
npm run start       # roda o build de produção
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run format       # Prettier (write)
npm run test:e2e     # Playwright
```

Testes locais do webhook da Stripe:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Migrações e policies do banco vivem em `supabase/migrations/` e `supabase/policies/`; aplicar com `supabase db push` (projeto Supabase linkado).

## Deploy em produção

Ver [docs/DEPLOY.md](docs/DEPLOY.md) — runbook com variáveis de ambiente de produção, configuração de domínio, webhook da Stripe em modo Live e checklist de validação do fluxo completo (signup → workspace → lead → pipeline → billing).
