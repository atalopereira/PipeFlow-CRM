-- RLS for public.activities — mirrors supabase/migrations/20260925120400_activities.sql

alter table public.activities enable row level security;
alter table public.activities force row level security;

create policy "activities_all_members" on public.activities
  for all to authenticated
  using ((select public.is_workspace_member(workspace_id)))
  with check ((select public.is_workspace_member(workspace_id)));
