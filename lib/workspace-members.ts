import type { SupabaseClient } from "@supabase/supabase-js";

import { getInitials } from "@/lib/utils";
import type { Database } from "@/types/supabase";
import type { WorkspaceInviteSummary, WorkspaceMemberSummary } from "@/types/workspace";

type MemberRowWithProfile = Database["public"]["Tables"]["workspace_members"]["Row"] & {
  profile: { full_name: string; email: string } | null;
};

function mapMemberRow(row: MemberRowWithProfile): WorkspaceMemberSummary {
  const name = row.profile?.full_name?.trim() || row.profile?.email || "Membro";
  return {
    userId: row.user_id,
    name,
    email: row.profile?.email ?? "",
    initials: getInitials(name),
    role: row.role,
    joinedAt: row.created_at,
  };
}

export async function getWorkspaceMembers(
  supabase: SupabaseClient<Database>,
  workspaceId: string
): Promise<WorkspaceMemberSummary[]> {
  const { data, error } = await supabase
    .from("workspace_members")
    .select(
      "user_id, role, created_at, profile:profiles!workspace_members_user_id_profiles_fkey(full_name, email)"
    )
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true })
    .returns<MemberRowWithProfile[]>();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapMemberRow);
}

function mapInviteRow(
  row: Database["public"]["Tables"]["workspace_invites"]["Row"]
): WorkspaceInviteSummary {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    token: row.token,
  };
}

export async function getPendingInvites(
  supabase: SupabaseClient<Database>,
  workspaceId: string
): Promise<WorkspaceInviteSummary[]> {
  const { data, error } = await supabase
    .from("workspace_invites")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapInviteRow);
}
