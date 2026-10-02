-- RLS for public.workspace_invites — mirrors
-- supabase/migrations/20260925120600_workspace_collaboration.sql

alter table public.workspace_invites enable row level security;
alter table public.workspace_invites force row level security;

create policy "workspace_invites_select_admin" on public.workspace_invites
  for select to authenticated
  using ((select public.is_workspace_admin(workspace_id)));
-- no insert/update/delete policy: all mutations go through invite_member() /
-- revoke_invite() / accept_invite() (security definer RPCs).
