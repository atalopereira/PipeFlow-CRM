import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

import { CURRENT_WORKSPACE_COOKIE } from "@/lib/constants/workspace-cookie";
import type { Database } from "@/types/supabase";

// Mirrors the resolution in app/(dashboard)/layout.tsx: prefer the cookie,
// but fall back to the user's first membership if it's missing or stale
// (e.g. points at a workspace the user is no longer part of).
export async function getCurrentWorkspaceId(
  supabase: SupabaseClient<Database>
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id);

  const workspaceIds = (memberships ?? []).map((membership) => membership.workspace_id);
  if (workspaceIds.length === 0) {
    return null;
  }

  const cookieStore = await cookies();
  const cookieWorkspaceId = cookieStore.get(CURRENT_WORKSPACE_COOKIE)?.value;

  return cookieWorkspaceId && workspaceIds.includes(cookieWorkspaceId)
    ? cookieWorkspaceId
    : workspaceIds[0];
}
