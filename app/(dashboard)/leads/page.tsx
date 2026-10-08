import { AlertTriangle, Plus } from "lucide-react";
import Link from "next/link";

import { LeadFormDialog } from "@/components/lead-form-dialog";
import { LeadsTable } from "@/components/leads-table";
import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LEAD_STATUS_IDS, type LeadStatusId } from "@/lib/constants/lead-status";
import { getLeadCount, getLeads } from "@/lib/leads";
import { canAddLead } from "@/lib/limits";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceId } from "@/lib/workspace";

interface LeadsPageProps {
  searchParams: { q?: string; status?: string };
}

function parseStatusFilter(value: string | undefined): "todos" | LeadStatusId {
  return value && LEAD_STATUS_IDS.includes(value as LeadStatusId)
    ? (value as LeadStatusId)
    : "todos";
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const search = searchParams.q ?? "";
  const statusFilter = parseStatusFilter(searchParams.status);

  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId(supabase);

  const [leads, { data: workspace }, leadCount] = workspaceId
    ? await Promise.all([
        getLeads(supabase, workspaceId, { search, statusId: statusFilter }),
        supabase.from("workspaces").select("plan").eq("id", workspaceId).single(),
        getLeadCount(supabase, workspaceId),
      ])
    : [[], { data: null }, 0];

  const leadLimit = canAddLead(workspace?.plan ?? "free", leadCount);

  return (
    <div className="flex flex-col gap-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-1">
      <PageHeader
        title="Leads"
        description="Gerencie seus leads e contatos."
        actions={
          leadLimit.allowed ? (
            <LeadFormDialog
              mode="create"
              trigger={
                <Button>
                  <Plus className="h-4 w-4" />
                  Novo lead
                </Button>
              }
            />
          ) : (
            <Button disabled title="Limite do plano Free atingido">
              <Plus className="h-4 w-4" />
              Novo lead
            </Button>
          )
        }
      />
      {!leadLimit.allowed ? (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Limite de leads do plano Free atingido</AlertTitle>
          <AlertDescription>
            Você já tem {leadLimit.current} de {leadLimit.limit} leads permitidos no plano Free.{" "}
            <Link href="/settings/billing" className="font-medium underline underline-offset-4">
              Faça upgrade para o Pro
            </Link>{" "}
            para adicionar leads ilimitados.
          </AlertDescription>
        </Alert>
      ) : null}
      <LeadsTable leads={leads} initialSearch={search} initialStatus={statusFilter} />
    </div>
  );
}
