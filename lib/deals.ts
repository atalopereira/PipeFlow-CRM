import type { SupabaseClient } from "@supabase/supabase-js";

import type { PipelineStageId } from "@/lib/constants/pipeline";
import { getInitials } from "@/lib/utils";
import type { Database } from "@/types/supabase";
import type { Deal } from "@/types/deal";

type DealRowWithRelations = Database["public"]["Tables"]["deals"]["Row"] & {
  owner: { full_name: string } | null;
  lead: { name: string; company: string | null } | null;
};

function buildOwner(profile: { full_name: string } | null) {
  const name = profile?.full_name?.trim() || "Membro";
  return { name, initials: getInitials(name) };
}

function mapDealRow(row: DealRowWithRelations): Deal {
  return {
    id: row.id,
    title: row.title,
    leadId: row.lead_id,
    lead: { name: row.lead?.name ?? "Lead removido", company: row.lead?.company ?? "" },
    value: row.value,
    stageId: row.stage_id as PipelineStageId,
    owner: buildOwner(row.owner),
    dueDate: row.due_date ?? "",
    createdAt: row.created_at,
  };
}

export async function getDeals(
  supabase: SupabaseClient<Database>,
  workspaceId: string
): Promise<Deal[]> {
  const { data, error } = await supabase
    .from("deals")
    .select(
      "*, owner:profiles!deals_owner_id_fkey(full_name), lead:leads!deals_lead_id_fkey(name, company)"
    )
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .returns<DealRowWithRelations[]>();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapDealRow);
}
