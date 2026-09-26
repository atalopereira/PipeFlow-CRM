-- Leads: status_id matches lib/constants/lead-status.ts (a different taxonomy
-- from deal pipeline stages).

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  owner_id uuid not null references public.profiles (id),
  name text not null,
  email text not null,
  phone text,
  company text,
  role text,
  status_id text not null default 'novo'
    check (status_id in ('novo', 'em_contato', 'qualificado', 'descartado')),
  estimated_value numeric(12, 2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index leads_workspace_id_idx on public.leads (workspace_id);
create index leads_owner_id_idx on public.leads (owner_id);
create trigger set_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

alter table public.leads enable row level security;
alter table public.leads force row level security;

create policy "leads_all_members" on public.leads
  for all to authenticated
  using ((select public.is_workspace_member(workspace_id)))
  with check ((select public.is_workspace_member(workspace_id)));
