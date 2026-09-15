import { Columns3, Plus } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function PipelinePage() {
  return (
    <div className="flex flex-col gap-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-1">
      <PageHeader
        title="Pipeline"
        description="Acompanhe seus negócios em cada etapa do funil."
        actions={
          <Button disabled>
            <Plus className="h-4 w-4" />
            Novo negócio
          </Button>
        }
      />
      <EmptyState
        icon={Columns3}
        title="Pipeline ainda vazio"
        description="O quadro Kanban com drag-and-drop chega na próxima aula."
      />
    </div>
  );
}
