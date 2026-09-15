import { Settings } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-1">
      <PageHeader title="Configurações" description="Preferências do workspace e da conta." />
      <EmptyState
        icon={Settings}
        title="Nada por aqui ainda"
        description="Configurações de workspace e colaboradores chegam em milestones futuros."
      />
    </div>
  );
}
