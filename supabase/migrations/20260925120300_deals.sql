-- Deals: stage_id matches lib/constants/pipeline.ts.

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  owner_id uuid not null references public.profiles (id),
  title text not null,
  value numeric(12, 2) not null default 0,
  stage_id text not null default 'novo_lead' check (
    stage_id in (
      'novo_lead', 'contato_realizado', 'proposta_enviada',
      'negociacao', 'fechado_ganho', 'fechado_perdido'
    )
  ),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index deals_workspace_id_idx on public.deals (workspace_id);
create index deals_lead_id_idx on public.deals (lead_id);
create index deals_owner_id_idx on public.deals (owner_id);
create trigger set_updated_at before update on public.deals
  for each row execute function public.set_updated_at();

alter table public.deals enable row level security;
alter table public.deals force row level security;

create policy "deals_all_members" on public.deals
  for all to authenticated
  using ((select public.is_workspace_member(workspace_id)))
  with check ((select public.is_workspace_member(workspace_id)));
