-- Workspaces (tenant root) + workspace_members (many-to-many membership with role).

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger set_updated_at before update on public.workspaces
  for each row execute function public.set_updated_at();

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);
create index workspace_members_user_id_idx on public.workspace_members (user_id);

alter table public.workspaces enable row level security;
alter table public.workspaces force row level security;
alter table public.workspace_members enable row level security;
alter table public.workspace_members force row level security;

-- security definer helpers so workspace_members' own RLS policy doesn't need to
-- recurse into itself, and so auth.uid() is looked up once per call, not per row.
create or replace function public.is_workspace_member(ws_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = ws_id and user_id = (select auth.uid())
  );
$$;

create or replace function public.is_workspace_admin(ws_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = ws_id and user_id = (select auth.uid()) and role = 'admin'
  );
$$;

create policy "workspaces_select_member" on public.workspaces
  for select to authenticated
  using ((select public.is_workspace_member(id)));

create policy "workspaces_update_admin" on public.workspaces
  for update to authenticated
  using ((select public.is_workspace_admin(id)))
  with check ((select public.is_workspace_admin(id)));
-- no insert/delete policy: creation goes through create_workspace() below;
-- deletion is out of scope for M8.

create policy "workspace_members_select_member" on public.workspace_members
  for select to authenticated
  using ((select public.is_workspace_member(workspace_id)));
-- no insert/update/delete policy yet: invites/role management land in M13 via their own RPC.

-- Atomically create a workspace and add the caller as its admin member.
-- Keeps the client from ever needing a permissive workspace_members insert policy.
create or replace function public.create_workspace(workspace_name text)
returns public.workspaces
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_workspace public.workspaces;
begin
  insert into public.workspaces (name, created_by)
  values (workspace_name, auth.uid())
  returning * into new_workspace;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (new_workspace.id, auth.uid(), 'admin');

  return new_workspace;
end;
$$;

grant execute on function public.create_workspace(text) to authenticated;
