-- RLS for public.deals — mirrors supabase/migrations/20260925120300_deals.sql

alter table public.deals enable row level security;
alter table public.deals force row level security;

create policy "deals_all_members" on public.deals
  for all to authenticated
  using ((select public.is_workspace_member(workspace_id)))
  with check ((select public.is_workspace_member(workspace_id)));
