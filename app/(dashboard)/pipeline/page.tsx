import { Plus } from "lucide-react";

import { DealFormDialog } from "@/components/deal-form-dialog";
import { KanbanBoard } from "@/components/kanban-board";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function PipelinePage() {
  return (
    <div className="flex h-full flex-col gap-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-1">
      <PageHeader
        title="Pipeline"
        description="Acompanhe seus negócios em cada etapa do funil."
        actions={
          <DealFormDialog
            trigger={
              <Button>
                <Plus className="h-4 w-4" />
                Novo negócio
              </Button>
            }
          />
        }
      />
      <KanbanBoard />
    </div>
  );
}
