import { DollarSign, Percent, TrendingUp, Users } from "lucide-react";

import { DealsByStageChart } from "@/components/deals-by-stage-chart";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { UpcomingDealsTable } from "@/components/upcoming-deals-table";
import {
  getConversionRate,
  getDealsByStage,
  getOpenDealsCount,
  getPipelineValue,
  getTotalLeads,
  getUpcomingDeals,
} from "@/lib/metrics";
import { MOCK_DEALS, NOW } from "@/lib/mock/deals";
import { MOCK_LEADS } from "@/lib/mock/leads";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const totalLeads = getTotalLeads(MOCK_LEADS);
  const openDeals = getOpenDealsCount(MOCK_DEALS);
  const pipelineValue = getPipelineValue(MOCK_DEALS);
  const conversionRate = getConversionRate(MOCK_DEALS);
  const stageData = getDealsByStage(MOCK_DEALS);
  const upcomingDeals = getUpcomingDeals(MOCK_DEALS, 5);
  const today = NOW.toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-1">
      <PageHeader title="Dashboard" description="Visão geral do seu funil de vendas." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total de leads"
          value={String(totalLeads)}
          icon={Users}
          iconClassName="bg-blue-500/10 text-blue-400"
          trend={{ value: 18, direction: "up" }}
          className="duration-500 animate-in fade-in-0 slide-in-from-bottom-2 [animation-delay:0ms] [animation-fill-mode:backwards]"
        />
        <StatCard
          label="Negócios abertos"
          value={String(openDeals)}
          icon={TrendingUp}
          iconClassName="bg-violet-500/10 text-violet-400"
          trend={{ value: 5, direction: "up" }}
          className="duration-500 animate-in fade-in-0 slide-in-from-bottom-2 [animation-delay:100ms] [animation-fill-mode:backwards]"
        />
        <StatCard
          label="Valor do pipeline"
          value={formatCurrency(pipelineValue)}
          icon={DollarSign}
          iconClassName="bg-amber-500/10 text-amber-400"
          trend={{ value: 23, direction: "up" }}
          className="duration-500 animate-in fade-in-0 slide-in-from-bottom-2 [animation-delay:200ms] [animation-fill-mode:backwards]"
        />
        <StatCard
          label="Taxa de conversão"
          value={`${Math.round(conversionRate * 100)}%`}
          icon={Percent}
          iconClassName="bg-emerald-500/10 text-emerald-400"
          trend={{ value: 4, direction: "up" }}
          className="duration-500 animate-in fade-in-0 slide-in-from-bottom-2 [animation-delay:300ms] [animation-fill-mode:backwards]"
        />
      </div>

      <DealsByStageChart data={stageData} />
      <UpcomingDealsTable deals={upcomingDeals} today={today} />
    </div>
  );
}
