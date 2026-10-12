-- Security audit (lesson 5.1) hardening. Three gaps found: RLS allowed an
-- admin's UPDATE policy to touch columns that must only ever be written by
-- trusted server-side code (the Stripe webhook, the signup trigger), and
-- nothing stopped a dual-member user from reassigning a row's workspace_id.
-- `auth.role()` reads the request JWT's role claim, which is 'service_role'
-- only when the call authenticates with the service-role key (the Stripe
-- webhook, via lib/supabase/admin.ts) — never for a browser/anon session.

-- workspaces.plan: previously writable by any workspace admin through the
-- existing workspaces_update_admin policy, letting a Free-plan admin grant
-- themselves Pro with a direct client-side update and skip Stripe entirely.
create or replace function public.prevent_client_plan_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.plan is distinct from old.plan and auth.role() <> 'service_role' then
    raise exception 'O plano só pode ser alterado pelo fluxo de cobrança.';
  end if;
  return new;
end;
$$;

create trigger prevent_client_plan_change_trigger
before update on public.workspaces
for each row execute function public.prevent_client_plan_change();

-- profiles.email: duplicated from auth.users for teammate-list display
-- (20260925120600_workspace_collaboration.sql). The profiles_update_own
-- policy lets a user update their own row, which also covers this column —
-- so any member could set it to an arbitrary address and have it shown to
-- teammates as their own, an impersonation/phishing vector. full_name stays
-- user-editable; email silently reverts to the auth.users-synced value.
create or replace function public.prevent_client_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is distinct from old.email and auth.role() <> 'service_role' then
    new.email := old.email;
  end if;
  return new;
end;
$$;

create trigger prevent_client_email_change_trigger
before update on public.profiles
for each row execute function public.prevent_client_email_change();

-- leads/deals/activities.workspace_id: the *_all_members policies correctly
-- require membership in both the old and the new workspace_id on an update,
-- but say nothing about the two being equal — a user who belongs to two
-- workspaces could move a row from one into the other directly. No app code
-- path ever changes workspace_id on update; this closes the gap at the DB
-- layer regardless of client.
create or replace function public.prevent_workspace_reassignment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.workspace_id is distinct from old.workspace_id then
    raise exception 'Não é possível mover este registro para outro workspace.';
  end if;
  return new;
end;
$$;

create trigger prevent_leads_workspace_reassignment_trigger
before update on public.leads
for each row execute function public.prevent_workspace_reassignment();

create trigger prevent_deals_workspace_reassignment_trigger
before update on public.deals
for each row execute function public.prevent_workspace_reassignment();

create trigger prevent_activities_workspace_reassignment_trigger
before update on public.activities
for each row execute function public.prevent_workspace_reassignment();
