-- RLS for public.workspaces — mirrors supabase/migrations/20260925120100_workspaces.sql

alter table public.workspaces enable row level security;
alter table public.workspaces force row level security;

create policy "workspaces_select_member" on public.workspaces
  for select to authenticated
  using ((select public.is_workspace_member(id)));

create policy "workspaces_update_admin" on public.workspaces
  for update to authenticated
  using ((select public.is_workspace_admin(id)))
  with check ((select public.is_workspace_admin(id)));
-- no insert/delete policy: creation goes through create_workspace(); deletion out of scope for M8.
