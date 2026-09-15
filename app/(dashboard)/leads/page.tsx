"use client";

import { Plus } from "lucide-react";

import { LeadFormDialog } from "@/components/lead-form-dialog";
import { LeadsTable } from "@/components/leads-table";
import { useLeads } from "@/components/leads-provider";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function LeadsPage() {
  const { leads } = useLeads();

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
      <LeadsTable leads={leads} />
    </div>
  );
}
