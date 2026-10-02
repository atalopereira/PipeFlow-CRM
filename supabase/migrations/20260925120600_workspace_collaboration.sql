-- M13: workspace invites, role management, and the profile visibility/FK
-- changes collaboration across a workspace depends on.

-- profiles.email: duplicated from auth.users (not exposed via RLS) so the
-- team members list can show it without a direct auth.users query.
alter table public.profiles add column email text not null default '';
update public.profiles p set email = u.email from auth.users u where u.id = p.id;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), coalesce(new.email, ''));
  return new;
end;
$$;

-- Lets any member of a shared workspace see another member's profile —
-- needed so teammate names/emails resolve in the team list and in the
-- owner/author embeds already used by leads, deals and activities.
create or replace function public.shares_workspace_with(target_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members mine
    join public.workspace_members theirs on theirs.workspace_id = mine.workspace_id
    where mine.user_id = (select auth.uid())
      and theirs.user_id = target_user_id
  );
$$;

create policy "profiles_select_workspace_members" on public.profiles
  for select to authenticated
  using ((select public.shares_workspace_with(id)));

-- workspace_members.user_id already references auth.users; add a second FK
-- to public.profiles so PostgREST can embed profile data on this table too
-- (the same `!constraint_name` embed hint already used for leads/deals/activities).
alter table public.workspace_members
  add constraint workspace_members_user_id_profiles_fkey
  foreign key (user_id) references public.profiles (id) on delete cascade;

-- Invites: one pending row per (workspace, email); accepting/revoking/
-- creating all go through the RPCs below so the table itself needs no
-- insert/update/delete policy, matching workspace_members.
create table public.workspace_invites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  email text not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  invited_by uuid not null references auth.users (id),
  token uuid not null default gen_random_uuid(),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  expires_at timestamptz not null default (now() + interval '7 days')
);
create unique index workspace_invites_token_idx on public.workspace_invites (token);
create unique index workspace_invites_pending_email_idx
  on public.workspace_invites (workspace_id, email) where status = 'pending';
create index workspace_invites_workspace_id_idx on public.workspace_invites (workspace_id);

alter table public.workspace_invites enable row level security;
alter table public.workspace_invites force row level security;

create policy "workspace_invites_select_admin" on public.workspace_invites
  for select to authenticated
  using ((select public.is_workspace_admin(workspace_id)));
-- no insert/update/delete policy: creation/revocation/acceptance go through
-- invite_member() / revoke_invite() / accept_invite() below.

-- Creates (or refreshes) a pending invite. Admin-only; upserts so re-inviting
-- the same pending email just resets the token/expiry instead of erroring.
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

grant execute on function public.invite_member(uuid, text, text) to authenticated;

-- Admin-only; only ever revokes a still-pending invite.
create or replace function public.revoke_invite(p_invite_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_workspace_id uuid;
begin
  select workspace_id into v_workspace_id
  from public.workspace_invites where id = p_invite_id;

  if v_workspace_id is null then
    raise exception 'Convite não encontrado.';
  end if;

  if not public.is_workspace_admin(v_workspace_id) then
    raise exception 'Apenas administradores podem revogar convites.';
  end if;

  update public.workspace_invites
  set status = 'revoked'
  where id = p_invite_id and status = 'pending';
end;
$$;

grant execute on function public.revoke_invite(uuid) to authenticated;

-- Public (anon-callable) lookup by token so the /invite/[token] page can show
-- who invited whom before the visitor has signed up or logged in. The token
-- itself is the secret (a random uuid), so this exposes no other row.
create or replace function public.get_invite_preview(p_token uuid)
returns table (
  workspace_name text,
  email text,
  role text,
  status text,
  expires_at timestamptz
)
language sql
security definer
stable
set search_path = ''
as $$
  select w.name, i.email, i.role, i.status, i.expires_at
  from public.workspace_invites i
  join public.workspaces w on w.id = i.workspace_id
  where i.token = p_token;
$$;

grant execute on function public.get_invite_preview(uuid) to anon, authenticated;

-- Joins the caller into the invite's workspace. Requires the caller's own
-- auth email to match the invite's email (case-insensitive). Idempotent: a
-- re-submit after acceptance just returns the workspace again.
create or replace function public.accept_invite(p_token uuid)
returns public.workspaces
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_invite public.workspace_invites;
  v_caller_email text;
  v_workspace public.workspaces;
begin
  if auth.uid() is null then
    raise exception 'É necessário estar autenticado para aceitar o convite.';
  end if;

  select * into v_invite from public.workspace_invites where token = p_token;

  if v_invite is null then
    raise exception 'Convite não encontrado.';
  end if;

  if v_invite.status = 'revoked' then
    raise exception 'Este convite foi revogado.';
  end if;

  if v_invite.status = 'pending' and v_invite.expires_at < now() then
    raise exception 'Este convite expirou.';
  end if;

  select email into v_caller_email from auth.users where id = auth.uid();

  if lower(v_caller_email) <> v_invite.email then
    raise exception 'Este convite foi enviado para outro e-mail.';
  end if;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (v_invite.workspace_id, auth.uid(), v_invite.role)
  on conflict (workspace_id, user_id) do nothing;

  if v_invite.status = 'pending' then
    update public.workspace_invites
    set status = 'accepted', accepted_at = now()
    where id = v_invite.id;
  end if;

  select * into v_workspace from public.workspaces where id = v_invite.workspace_id;
  return v_workspace;
end;
$$;

grant execute on function public.accept_invite(uuid) to authenticated;

-- Admin-only role change; blocked if it would leave the workspace with no
-- admin at all.
create or replace function public.update_member_role(
  p_workspace_id uuid,
  p_user_id uuid,
  p_role text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_current_role text;
  v_admin_count int;
begin
  if not public.is_workspace_admin(p_workspace_id) then
    raise exception 'Apenas administradores podem alterar papéis.';
  end if;

  if p_role not in ('admin', 'member') then
    raise exception 'Papel inválido.';
  end if;

  select role into v_current_role from public.workspace_members
  where workspace_id = p_workspace_id and user_id = p_user_id;

  if v_current_role is null then
    raise exception 'Membro não encontrado.';
  end if;

  if v_current_role = 'admin' and p_role <> 'admin' then
    select count(*) into v_admin_count from public.workspace_members
    where workspace_id = p_workspace_id and role = 'admin';

    if v_admin_count <= 1 then
      raise exception 'O workspace precisa de ao menos um administrador.';
    end if;
  end if;

  update public.workspace_members set role = p_role
  where workspace_id = p_workspace_id and user_id = p_user_id;
end;
$$;

grant execute on function public.update_member_role(uuid, uuid, text) to authenticated;

-- Admins can remove anyone; a member can only remove themself (leave the
-- workspace). Blocked if it would remove the last admin.
create or replace function public.remove_member(p_workspace_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_target_role text;
  v_admin_count int;
begin
  if p_user_id <> auth.uid() and not public.is_workspace_admin(p_workspace_id) then
    raise exception 'Apenas administradores podem remover outros colaboradores.';
  end if;

  select role into v_target_role from public.workspace_members
  where workspace_id = p_workspace_id and user_id = p_user_id;

  if v_target_role is null then
    raise exception 'Membro não encontrado.';
  end if;

  if v_target_role = 'admin' then
    select count(*) into v_admin_count from public.workspace_members
    where workspace_id = p_workspace_id and role = 'admin';

    if v_admin_count <= 1 then
      raise exception 'O workspace precisa de ao menos um administrador.';
    end if;
  end if;

  delete from public.workspace_members
  where workspace_id = p_workspace_id and user_id = p_user_id;
end;
$$;

grant execute on function public.remove_member(uuid, uuid) to authenticated;
