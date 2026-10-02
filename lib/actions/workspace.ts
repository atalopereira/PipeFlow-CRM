"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import {
  CURRENT_WORKSPACE_COOKIE,
  WORKSPACE_COOKIE_MAX_AGE,
} from "@/lib/constants/workspace-cookie";
import type { WorkspaceRole } from "@/lib/constants/workspace-role";
import { sendWorkspaceInviteEmail } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";
import { inviteMemberSchema, type InviteMemberValues } from "@/lib/validations/workspace-member";

export interface ActionResult {
  error?: string;
}

export async function inviteMember(
  workspaceId: string,
  workspaceName: string,
  input: InviteMemberValues
): Promise<ActionResult> {
  const parsed = inviteMemberSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Dados do convite inválidos." };
  }

  const supabase = await createClient();
  const { data: invite, error } = await supabase.rpc("invite_member", {
    p_workspace_id: workspaceId,
    p_email: parsed.data.email,
    p_role: parsed.data.role,
  });

  if (error || !invite) {
    return { error: error?.message ?? "Não foi possível criar o convite." };
  }

  await sendWorkspaceInviteEmail({
    to: invite.email,
    workspaceName,
    role: invite.role,
    token: invite.token,
  });

  revalidatePath("/settings");
  return {};
}

export async function revokeInvite(inviteId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("revoke_invite", { p_invite_id: inviteId });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return {};
}

export async function acceptInvite(token: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: workspace, error } = await supabase.rpc("accept_invite", { p_token: token });

  if (error || !workspace) {
    return { error: error?.message ?? "Não foi possível aceitar o convite." };
  }

  const cookieStore = await cookies();
  cookieStore.set(CURRENT_WORKSPACE_COOKIE, workspace.id, {
    path: "/",
    maxAge: WORKSPACE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });

  return {};
}

export async function updateMemberRole(
  workspaceId: string,
  userId: string,
  role: WorkspaceRole
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("update_member_role", {
    p_workspace_id: workspaceId,
    p_user_id: userId,
    p_role: role,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return {};
}

export async function removeMember(workspaceId: string, userId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("remove_member", {
    p_workspace_id: workspaceId,
    p_user_id: userId,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return {};
}
