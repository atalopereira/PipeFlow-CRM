-- Subscriptions: one row per workspace, written only by the Stripe webhook (M14)
-- via the service role key, which bypasses RLS. Clients only ever read this table.

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null unique references public.workspaces (id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  status text not null default 'inactive'
    check (status in ('inactive', 'trialing', 'active', 'past_due', 'canceled')),
  plan text not null default 'free' check (plan in ('free', 'pro')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index subscriptions_workspace_id_idx on public.subscriptions (workspace_id);
create trigger set_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();

alter table public.subscriptions enable row level security;
alter table public.subscriptions force row level security;

create policy "subscriptions_select_member" on public.subscriptions
  for select to authenticated
  using ((select public.is_workspace_member(workspace_id)));
-- no insert/update/delete policy: only the Stripe webhook (M14) writes here, using the
-- service role key, which bypasses RLS entirely — never exposed to the client.
