-- RLS for public.profiles — mirrors supabase/migrations/20260925120000_profiles.sql
-- and supabase/migrations/20260925120600_workspace_collaboration.sql (email
-- column + workspace-visibility policy, added in M13).

alter table public.profiles enable row level security;
alter table public.profiles force row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_select_workspace_members" on public.profiles
  for select to authenticated
  using ((select public.shares_workspace_with(id)));

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
