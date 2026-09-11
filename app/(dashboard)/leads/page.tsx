import { Plus, Users } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function LeadsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Leads"
        description="Gerencie seus leads e contatos."
        actions={
          <Button disabled>
            <Plus className="h-4 w-4" />
            Novo lead
          </Button>
        }
      />
      <EmptyState
        icon={Users}
        title="Nenhum lead ainda"
        description="A listagem de leads chega na próxima aula."
      />
    </div>
  );
}
