# PLAN: PipeFlow CRM — Execução

Plano de execução do PRD ([docs/PRD.md](./PRD.md)), seguindo o stack e as convenções definidos em [CLAUDE.md](../CLAUDE.md). Ordem: **setup → interface (com dados mock) → backend (conectando cada tela ao Supabase/Stripe) → deploy final.** Construir a UI primeiro permite validar fluxo e UX antes de investir em schema/RLS/integrações.

Cada milestone roda em sua própria branch a partir de `main`, termina com um commit final e deve ser mergeado (ou revisado) antes de abrir a próxima branch.

---

## M0 — Setup do Projeto
**Branch:** `setup/project-init`
**Objetivo:** Scaffold do projeto rodando localmente e publicável, sem funcionalidades ainda.

- [x] Inicializar Next.js 14 (App Router) + TypeScript + Tailwind CSS
- [x] Instalar e configurar shadcn/ui (estilo "new-york")
- [x] Configurar ESLint + Prettier
- [x] Criar estrutura de pastas conforme CLAUDE.md (`app/`, `components/`, `lib/`, `hooks/`, `types/`, `supabase/`)
- [x] `git init` + primeiro commit + repositório remoto (GitHub)
- [x] Deploy inicial vazio na Vercel (validar pipeline de deploy)

**Commit final:** `chore: scaffold Next.js project with Tailwind, shadcn/ui and base structure`

---

## M1 — UI: Landing Page
**Branch:** `feature/landing-page-ui`
**Objetivo:** Página pública de apresentação do produto.

- [ ] Seção Hero
- [ ] Seção de Planos e Preços (Free / Pro)
- [ ] Seção CTA
- [ ] Layout responsivo (mobile/desktop)

**Commit final:** `feat: add public landing page (hero, pricing, CTA)`

---

## M2 — UI: Autenticação
**Branch:** `feature/auth-ui`
**Objetivo:** Telas de login e cadastro, sem integração real ainda (mock/local state).

- [ ] Tela de Login
- [ ] Tela de Signup
- [ ] Validação de formulário no client
- [ ] Estados de erro/loading (visuais)

**Commit final:** `feat: add login and signup screens (UI only)`

---

## M3 — UI: Shell do Dashboard
**Branch:** `feature/dashboard-shell-ui`
**Objetivo:** Casca da aplicação autenticada — navegação e troca de workspace (mock).

- [ ] Layout autenticado (sidebar + área de conteúdo)
- [ ] Sidebar com navegação (Leads, Pipeline, Dashboard, Configurações)
- [ ] Dropdown de troca de workspace (dados mock)
- [ ] Estado vazio/skeleton padrão para as páginas internas

**Commit final:** `feat: add authenticated dashboard shell with sidebar and workspace switcher`

---

## M4 — UI: Leads e Contatos
**Branch:** `feature/leads-ui`
**Objetivo:** Gestão de leads na interface, com dados mock.

- [ ] Listagem de leads (tabela/cards) com dados mock
- [ ] Busca e filtros (status, responsável, data) — client-side sobre mock
- [ ] Formulário de cadastro/edição de lead
- [ ] Página de detalhe do lead (perfil + timeline de atividades mock)

**Commit final:** `feat: add leads listing, detail page and mock data`

---

## M5 — UI: Pipeline Kanban
**Branch:** `feature/kanban-ui`
**Objetivo:** Pipeline visual funcional sobre dados mock, sem persistência.

- [ ] Colunas por etapa (Novo Lead → Contato → Proposta → Negociação → Ganho/Perdido)
- [ ] Cards de negócio (título, valor, lead vinculado, responsável, prazo)
- [ ] Drag-and-drop entre colunas com @dnd-kit (estado local apenas)

**Commit final:** `feat: add Kanban pipeline UI with drag-and-drop (mock data)`

---

## M6 — UI: Dashboard de Métricas
**Branch:** `feature/metrics-ui`
**Objetivo:** Visualização de métricas com dados mock.

- [ ] Cards: total de leads, negócios abertos, valor total do pipeline, taxa de conversão
- [ ] Gráfico de funil de vendas (Recharts) sobre dados mock
- [ ] Lista de negócios com prazo próximo

**Commit final:** `feat: add metrics dashboard with funnel chart (mock data)`

---

## M7 — Backend: Supabase, Auth e Workspace
**Branch:** `feature/supabase-auth-backend`
**Objetivo:** Conectar autenticação e criação de workspace ao Supabase real.

- [ ] Criar projeto Supabase + schema inicial (`workspaces`, `users`/profiles)
- [ ] Configurar Supabase Auth e conectar às telas de login/signup (M2)
- [ ] Fluxo de criação de workspace no onboarding
- [ ] RLS habilitada nas tabelas criadas (isolamento por `workspace_id`)

**Commit final:** `feat: connect auth and workspace creation to Supabase with RLS`

---

## M8 — Backend: Leads
**Branch:** `feature/leads-backend`
**Objetivo:** Substituir os dados mock de leads por dados reais.

- [ ] Tabela `leads` (schema + RLS por `workspace_id`)
- [ ] Conectar listagem, busca e filtros (M4) ao Supabase
- [ ] Conectar formulário de criação/edição e página de detalhe

**Commit final:** `feat: connect leads UI to Supabase (CRUD + RLS)`

---

## M9 — Backend: Pipeline
**Branch:** `feature/pipeline-backend`
**Objetivo:** Persistir negócios e movimentação entre etapas.

- [ ] Tabela `deals` (schema + RLS)
- [ ] Conectar Kanban (M5) ao Supabase — criação de negócio e persistência do drag-and-drop

**Commit final:** `feat: persist deals and pipeline stage changes to Supabase`

---

## M10 — Backend: Atividades
**Branch:** `feature/activities-backend`
**Objetivo:** Registro real de atividades na timeline do lead.

- [ ] Tabela `activities` (tipo, autor, descrição, data + RLS)
- [ ] Conectar timeline do lead (M4) para ler/gravar atividades reais

**Commit final:** `feat: connect activity timeline to Supabase`

---

## M11 — Backend: Dashboard de Métricas
**Branch:** `feature/metrics-backend`
**Objetivo:** Métricas calculadas a partir de dados reais.

- [ ] Queries agregadas para os cards de métricas (M6)
- [ ] Conectar gráfico de funil e lista de prazos próximos a dados reais

**Commit final:** `feat: compute dashboard metrics from real Supabase data`

---

## M12 — Backend: Multi-empresa e Colaboração
**Branch:** `feature/workspace-collab-backend`
**Objetivo:** Convite de colaboradores e papéis funcionando de ponta a ponta.

- [ ] Convite de colaboradores por e-mail (Resend)
- [ ] Papéis Admin/Membro com permissões aplicadas (RLS + checagem na UI)
- [ ] Troca real entre workspaces (M3) usando dados do usuário autenticado

**Commit final:** `feat: add real workspace invites, roles and switching`

---

## M13 — Backend: Monetização (Stripe)
**Branch:** `feature/stripe-billing`
**Objetivo:** Cobrança de assinatura funcionando ponta a ponta.

- [ ] Stripe Checkout para upgrade Free → Pro
- [ ] Webhook de ativação/desativação de plano (idempotente, com verificação de assinatura)
- [ ] Customer Portal para gerenciamento de assinatura
- [ ] Enforcement dos limites do plano Free (2 colaboradores / 50 leads) na aplicação

**Commit final:** `feat: add Stripe checkout, webhook and plan limit enforcement`

---

## M14 — Deploy de Produção
**Branch:** `chore/production-deploy`
**Objetivo:** Aplicação publicada em produção com todas as integrações configuradas.

- [ ] Variáveis de ambiente de produção (Supabase, Stripe, Resend) na Vercel
- [ ] Domínio configurado
- [ ] Webhook do Stripe apontando para produção
- [ ] Checklist final: fluxo completo (signup → workspace → lead → pipeline → billing) testado em produção

**Commit final:** `chore: configure production environment and go live`

---

## Depois do M14
Busca/filtros avançados, permissões mais granulares, integrações via API públicas — conforme demanda, fora do escopo do MVP.
