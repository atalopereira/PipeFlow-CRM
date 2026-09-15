import { DollarSign, Percent, TrendingUp, Users } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { StageBadge } from "@/components/stage-badge";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PIPELINE_STAGES } from "@/lib/constants/pipeline";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-1">
      <PageHeader title="Dashboard" description="Visão geral do seu funil de vendas." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total de leads"
          value="128"
          icon={Users}
          className="duration-500 animate-in fade-in-0 slide-in-from-bottom-2 [animation-delay:0ms] [animation-fill-mode:backwards]"
        />
        <StatCard
          label="Negócios abertos"
          value="24"
          icon={TrendingUp}
          className="duration-500 animate-in fade-in-0 slide-in-from-bottom-2 [animation-delay:100ms] [animation-fill-mode:backwards]"
        />
        <StatCard
          label="Valor em pipeline"
          value="R$ 186.400"
          icon={DollarSign}
          className="duration-500 animate-in fade-in-0 slide-in-from-bottom-2 [animation-delay:200ms] [animation-fill-mode:backwards]"
        />
        <StatCard
          label="Taxa de conversão"
          value="32%"
          icon={Percent}
          className="duration-500 animate-in fade-in-0 slide-in-from-bottom-2 [animation-delay:300ms] [animation-fill-mode:backwards]"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">Estágios do pipeline</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {PIPELINE_STAGES.map((stage) => (
            <StageBadge key={stage.id} stageId={stage.id} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
