-- RLS for public.leads — mirrors supabase/migrations/20260925120200_leads.sql

alter table public.leads enable row level security;
alter table public.leads force row level security;

create policy "leads_all_members" on public.leads
  for all to authenticated
  using ((select public.is_workspace_member(workspace_id)))
  with check ((select public.is_workspace_member(workspace_id)));
