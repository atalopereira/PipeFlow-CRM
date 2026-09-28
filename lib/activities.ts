import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";
import type { Activity, ActivityType } from "@/types/activity";

type ActivityRowWithAuthor = Database["public"]["Tables"]["activities"]["Row"] & {
  author: { full_name: string } | null;
};

function mapActivityRow(row: ActivityRowWithAuthor): Activity {
  return {
    id: row.id,
    leadId: row.lead_id,
    type: row.type as ActivityType,
    title: row.title,
    author: row.author?.full_name?.trim() || "Membro",
    description: row.description ?? "",
    date: row.occurred_at,
  };
}

export async function getActivitiesForLead(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
  leadId: string
): Promise<Activity[]> {
  const { data, error } = await supabase
    .from("activities")
    .select("*, author:profiles!activities_author_id_fkey(full_name)")
    .eq("workspace_id", workspaceId)
    .eq("lead_id", leadId)
    .order("occurred_at", { ascending: false })
    .returns<ActivityRowWithAuthor[]>();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapActivityRow);
}
