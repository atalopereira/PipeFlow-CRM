# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project Overview

**PipeFlow CRM** is a multi-tenant SaaS CRM for small/medium businesses and sales teams: visual Kanban pipeline, lead/contact management, activity timeline, multi-company workspaces, and Stripe subscription billing. Full product spec: [docs/PRD.md](docs/PRD.md). Execution plan: [docs/PLAN.md](docs/PLAN.md) — milestones M0 → M14, each on its own branch, UI first (mock data) then backend (Supabase/Stripe wiring), ending in production deploy. Follow it in order; each milestone ends with the commit described in its "Commit final" line before starting the next.

The repo is currently greenfield (no scaffolding yet). M0 in the plan covers initial Next.js/Supabase setup.

## Tech Stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript 5 (strict mode)
- **UI**: Tailwind CSS + shadcn/ui ("new-york" style)
- **Backend**: Next.js Route Handlers / Server Actions (no separate backend service)
- **Database + Auth**: Supabase (PostgreSQL, Auth, Row Level Security)
- **Payments**: Stripe (Checkout, webhooks, Customer Portal)
- **Transactional email**: Resend
- **Drag-and-drop**: @dnd-kit (Kanban pipeline)
- **Charts**: Recharts (funnel chart, dashboard)
- **Deploy**: Vercel (app) + Supabase (DB/Auth)

Don't introduce a different framework/library for something this stack already covers (e.g. no Redux, no separate Express server, no alternative charting or DnD library).

## Folder Structure

Next.js App Router layout — route groups separate marketing, auth, and the authenticated app:

```
app/
├── (marketing)/          # public landing page
├── (auth)/               # login, signup
├── (dashboard)/          # authenticated app, scoped by workspace
│   ├── leads/
│   ├── pipeline/
│   ├── dashboard/
│   └── settings/
└── api/                  # route handlers (webhooks, etc.)
components/
├── ui/                   # shadcn primitives (generated, don't hand-edit)
└── ...                   # feature components (kanban-card, lead-timeline, ...)
lib/
├── supabase/             # client/server Supabase clients
├── stripe/               # Stripe client + helpers
└── utils.ts
hooks/
types/
supabase/
├── migrations/
└── policies/             # RLS policy SQL
docs/
```

## Conventions

- **Naming**: kebab-case files (`lead-detail-card.tsx`), PascalCase components (`LeadDetailCard`), camelCase functions/variables, UPPER_SNAKE_CASE constants.
- **Components**: Server Components by default. Add `"use client"` only when the component needs interactivity, browser APIs, or hooks (e.g. the Kanban board, forms).
- **Types**: explicit types on function params/returns, no `any` (use `unknown` + narrowing). Prefer interfaces for object shapes.
- **Multi-tenancy is the core invariant**: every table that stores workspace data carries a `workspace_id` column, and every table has RLS enabled — never rely on application-level filtering alone to isolate workspaces. When adding a new table or query, confirm the RLS policy exists before considering the feature done.
- **Stripe webhooks**: handlers must be idempotent (Stripe retries deliveries) and verify the webhook signature before processing.
- Reuse shadcn/ui primitives from `components/ui` instead of hand-rolling equivalents (buttons, dialogs, dropdowns, badges, etc.).

## Visual Identity

Starting point, inspired by the PRD's references — Pipedrive's clean, pipeline-first focus over HubSpot's denser, feature-heavy UI. Treat as a baseline to refine once real screens are being built, not a locked brand system.

- **Feel**: clean, uncluttered, sales-focused — the pipeline and the next action should always be the visual focus of the screen.
- **Base palette**: neutral slate grays (shadcn `slate`) for backgrounds/text/borders.
- **Accent**: indigo (`#4F46E5`-ish) for primary actions, links, active nav state.
- **Pipeline stage colors** (badges/columns): gray = Novo Lead, blue = Contato Realizado, amber = Proposta Enviada, violet = Negociação, green = Fechado Ganho, red = Fechado Perdido.
- **Typography**: Inter, clear size hierarchy for dashboard stat cards (large numeral, small muted label).
- **Shape**: rounded-lg corners, card-based layout (shadcn defaults) — Kanban cards, stat cards, and stage badges are the components to get pixel-right first since they're the most-seen UI in the product.

## Development Workflow

No `package.json` exists yet (M1 sets this up). Once scaffolded, standard commands apply: `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, plus `supabase db push` for migrations and `stripe listen --forward-to localhost:3000/api/webhooks/stripe` for local webhook testing. Update this section once scaffolding lands with the actual scripts in `package.json`.

Before committing: typecheck, lint, and confirm any new/changed table has a matching RLS policy under `supabase/policies/`.

**Always ask before committing.** Never run `git commit` (or `git push`) on your own initiative — prepare the change, show the user what would be committed (e.g. `git status` / `git diff`), and wait for an explicit go-ahead first, even if the task otherwise seems complete.
