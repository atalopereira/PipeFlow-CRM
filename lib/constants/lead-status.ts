export type LeadStatusId = "novo" | "em_contato" | "qualificado" | "descartado";

export interface LeadStatusConfig {
  id: LeadStatusId;
  label: string;
  badgeClassName: string;
  dotClassName: string;
}

export const LEAD_STATUSES: LeadStatusConfig[] = [
  {
    id: "novo",
    label: "Novo",
    badgeClassName: "border-amber-500/30 bg-amber-500/15 text-amber-400",
    dotClassName: "bg-amber-400",
  },
  {
    id: "em_contato",
    label: "Em Contato",
    badgeClassName: "border-blue-500/30 bg-blue-500/15 text-blue-400",
    dotClassName: "bg-blue-400",
  },
  {
    id: "qualificado",
    label: "Qualificado",
    badgeClassName: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
    dotClassName: "bg-emerald-400",
  },
  {
    id: "descartado",
    label: "Descartado",
    badgeClassName: "border-red-500/30 bg-red-500/15 text-red-400",
    dotClassName: "bg-red-400",
  },
];

export const LEAD_STATUS_MAP: Record<LeadStatusId, LeadStatusConfig> = Object.fromEntries(
  LEAD_STATUSES.map((status) => [status.id, status])
) as Record<LeadStatusId, LeadStatusConfig>;

export const LEAD_STATUS_IDS = LEAD_STATUSES.map((status) => status.id) as [
  LeadStatusId,
  ...LeadStatusId[],
];

export const DEFAULT_LEAD_STATUS_ID: LeadStatusId = "novo";
