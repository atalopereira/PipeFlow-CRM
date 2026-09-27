import { Plus } from "lucide-react";

import { LeadFormDialog } from "@/components/lead-form-dialog";
import { LeadsTable } from "@/components/leads-table";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { LEAD_STATUS_IDS, type LeadStatusId } from "@/lib/constants/lead-status";
import { getLeads } from "@/lib/leads";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceId } from "@/lib/workspace";

interface LeadsPageProps {
  searchParams: { q?: string; status?: string };
}

function parseStatusFilter(value: string | undefined): "todos" | LeadStatusId {
  return value && LEAD_STATUS_IDS.includes(value as LeadStatusId) ? (value as LeadStatusId) : "todos";
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const search = searchParams.q ?? "";
  const statusFilter = parseStatusFilter(searchParams.status);

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId(supabase);
  const leads = workspaceId
    ? await getLeads(supabase, workspaceId, { search, statusId: statusFilter })
    : [];

  return (
    <div className="flex flex-col gap-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-1">
      <PageHeader
        title="Leads"
        description="Gerencie seus leads e contatos."
        actions={
          <LeadFormDialog
            mode="create"
            trigger={
              <Button>
                <Plus className="h-4 w-4" />
                Novo lead
              </Button>
            }
          />
        }
      />
      <LeadsTable leads={leads} initialSearch={search} initialStatus={statusFilter} />
    </div>
  );
}
