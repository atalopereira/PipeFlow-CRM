import type { SupabaseClient } from "@supabase/supabase-js";

import type { LeadStatusId } from "@/lib/constants/lead-status";
import { getInitials } from "@/lib/utils";
import type { Database } from "@/types/supabase";
import type { Lead, LeadOwner } from "@/types/lead";

type LeadRowWithOwner = Database["public"]["Tables"]["leads"]["Row"] & {
  owner: { full_name: string } | null;
};

export interface LeadFilters {
  search?: string;
  statusId?: "todos" | LeadStatusId;
}

// PostgREST's .or() takes a raw filter expression — comma/parens are
// syntax delimiters there, so strip them instead of interpolating
// user input directly (a name/company search never needs them).
function sanitizeSearchTerm(term: string): string {
  return term.replace(/[,()%]/g, "").trim();
}

function buildOwner(profile: { full_name: string } | null): LeadOwner {
  const name = profile?.full_name?.trim() || "Membro";
  return { name, initials: getInitials(name) };
}

function mapLeadRow(row: LeadRowWithOwner): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? "",
    company: row.company ?? "",
    role: row.role ?? "",
    statusId: row.status_id,
    owner: buildOwner(row.owner),
    createdAt: row.created_at,
    estimatedValue: row.estimated_value ?? undefined,
    notes: row.notes ?? undefined,
  };
}

export async function getLeads(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
  filters: LeadFilters = {}
): Promise<Lead[]> {
  let query = supabase
    .from("leads")
    .select("*, owner:profiles!leads_owner_id_fkey(full_name)")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  const search = filters.search ? sanitizeSearchTerm(filters.search) : "";
  if (search) {
    query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%`);
  }

  if (filters.statusId && filters.statusId !== "todos") {
    query = query.eq("status_id", filters.statusId);
  }

  const { data, error } = await query.returns<LeadRowWithOwner[]>();
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapLeadRow);
}

export async function getLeadById(
  supabase: SupabaseClient<Database>,
  workspaceId: string,
  leadId: string
): Promise<Lead | null> {
  const { data, error } = await supabase
    .from("leads")
    .select("*, owner:profiles!leads_owner_id_fkey(full_name)")
    .eq("workspace_id", workspaceId)
    .eq("id", leadId)
    .maybeSingle<LeadRowWithOwner>();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapLeadRow(data) : null;
}
