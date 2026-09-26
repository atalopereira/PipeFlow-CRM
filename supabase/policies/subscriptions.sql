-- RLS for public.subscriptions — mirrors supabase/migrations/20260925120500_subscriptions.sql

alter table public.subscriptions enable row level security;
alter table public.subscriptions force row level security;

create policy "subscriptions_select_member" on public.subscriptions
  for select to authenticated
  using ((select public.is_workspace_member(workspace_id)));
-- no insert/update/delete policy: only the Stripe webhook (M14) writes here, using the
-- service role key, which bypasses RLS entirely — never exposed to the client.
