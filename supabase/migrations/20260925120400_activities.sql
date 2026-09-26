-- Activities: type matches lib/constants/activity-type.ts / types/activity.ts.

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  author_id uuid not null references public.profiles (id),
  type text not null check (type in ('ligacao', 'email', 'reuniao', 'nota')),
  title text not null,
  description text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index activities_workspace_id_idx on public.activities (workspace_id);
create index activities_lead_id_idx on public.activities (lead_id);

alter table public.activities enable row level security;
alter table public.activities force row level security;

create policy "activities_all_members" on public.activities
  for all to authenticated
  using ((select public.is_workspace_member(workspace_id)))
  with check ((select public.is_workspace_member(workspace_id)));
