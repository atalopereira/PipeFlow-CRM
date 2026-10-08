-- M14: enforce Free-plan limits (2 collaborators / 50 leads) at the database
-- layer, so they hold regardless of which client calls the API.

-- Leads: no RPC exists for creation (direct insert under the
-- leads_all_members RLS policy), so the limit is enforced with a trigger.
create or replace function public.enforce_lead_plan_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select plan from public.workspaces where id = new.workspace_id) = 'free'
     and (select count(*) from public.leads where workspace_id = new.workspace_id) >= 50 then
    raise exception 'O plano Free permite no máximo 50 leads. Faça upgrade para o Pro para adicionar mais.';
  end if;
  return new;
end;
$$;

create trigger enforce_lead_plan_limit_trigger
before insert on public.leads
for each row execute function public.enforce_lead_plan_limit();

-- Collaborators: invite_member() already gates creation, so the limit is
-- added there — counting current members plus other pending invites (the
-- invite being created/renewed for v_email is excluded from its own count).
create or replace function public.invite_member(
  p_workspace_id uuid,
  p_email text,
  p_role text default 'member'
)
returns public.workspace_invites
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
  v_existing_user_id uuid;
  v_invite public.workspace_invites;
begin
  if not public.is_workspace_admin(p_workspace_id) then
    raise exception 'Apenas administradores podem convidar colaboradores.';
  end if;

  if p_role not in ('admin', 'member') then
    raise exception 'Papel inválido.';
  end if;

  if v_email = '' or position('@' in v_email) < 2 or position('.' in v_email) = 0 then
    raise exception 'E-mail inválido.';
  end if;

  select id into v_existing_user_id from auth.users where lower(email) = v_email;

  if v_existing_user_id is not null and exists (
    select 1 from public.workspace_members
    where workspace_id = p_workspace_id and user_id = v_existing_user_id
  ) then
    raise exception 'Este usuário já faz parte do workspace.';
  end if;

  if (select plan from public.workspaces where id = p_workspace_id) = 'free'
     and (
       (select count(*) from public.workspace_members where workspace_id = p_workspace_id)
       + (select count(*) from public.workspace_invites
          where workspace_id = p_workspace_id and status = 'pending' and expires_at > now()
            and email <> v_email)
     ) >= 2 then
    raise exception 'O plano Free permite no máximo 2 colaboradores. Faça upgrade para o Pro para convidar mais pessoas.';
  end if;

  insert into public.workspace_invites (workspace_id, email, role, invited_by)
  values (p_workspace_id, v_email, p_role, auth.uid())
  on conflict (workspace_id, email) where (status = 'pending')
  do update set
    role = excluded.role,
    token = gen_random_uuid(),
    created_at = now(),
    expires_at = now() + interval '7 days'
  returning * into v_invite;

  return v_invite;
end;
$$;
