-- RLS for public.workspace_members — mirrors supabase/migrations/20260925120100_workspaces.sql

alter table public.workspace_members enable row level security;
alter table public.workspace_members force row level security;

create policy "workspace_members_select_member" on public.workspace_members
  for select to authenticated
  using ((select public.is_workspace_member(workspace_id)));
-- no insert/update/delete policy yet: invites/role management land in M13 via their own RPC.
