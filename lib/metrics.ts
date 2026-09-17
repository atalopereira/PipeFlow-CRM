import { PIPELINE_STAGES, type PipelineStageId } from "@/lib/constants/pipeline";
import type { Deal } from "@/types/deal";
import type { Lead } from "@/types/lead";

const CLOSED_STAGE_IDS: readonly PipelineStageId[] = ["fechado_ganho", "fechado_perdido"];

export function getTotalLeads(leads: Lead[]): number {
  return leads.length;
}

export function getOpenDeals(deals: Deal[]): Deal[] {
  return deals.filter((deal) => !CLOSED_STAGE_IDS.includes(deal.stageId));
}

export function getOpenDealsCount(deals: Deal[]): number {
  return getOpenDeals(deals).length;
}

export function getPipelineValue(deals: Deal[]): number {
  return getOpenDeals(deals).reduce((sum, deal) => sum + deal.value, 0);
}

/**
 * Win rate among decided deals: fechado_ganho / (fechado_ganho + fechado_perdido).
 * Deals still open (not yet won or lost) are excluded from the denominator —
 * a deal in `novo_lead` hasn't "failed to convert," it just hasn't been decided.
 * Returns a 0–1 fraction; format as a percentage at the call site.
 */
export function getConversionRate(deals: Deal[]): number {
  const won = deals.filter((deal) => deal.stageId === "fechado_ganho").length;
  const lost = deals.filter((deal) => deal.stageId === "fechado_perdido").length;
  const decided = won + lost;
  return decided === 0 ? 0 : won / decided;
}

export interface StageFunnelDatum {
  stageId: PipelineStageId;
  label: string;
  count: number;
  value: number;
  color: string;
}

export function getDealsByStage(deals: Deal[]): StageFunnelDatum[] {
  return PIPELINE_STAGES.map((stage) => {
    const stageDeals = deals.filter((deal) => deal.stageId === stage.id);
    return {
      stageId: stage.id,
      label: stage.label,
      count: stageDeals.length,
      value: stageDeals.reduce((sum, deal) => sum + deal.value, 0),
      color: stage.chartColor,
    };
  });
}

export function getUpcomingDeals(deals: Deal[], limit = 5): Deal[] {
  return getOpenDeals(deals)
    .slice()
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, limit);
}

/**
 * `dueDate` and `referenceDate` are both "YYYY-MM-DD" strings, so lexicographic
 * comparison equals chronological comparison — no Date parsing/timezone risk.
 */
export function isDealOverdue(dueDate: string, referenceDate: string): boolean {
  return dueDate < referenceDate;
}
