import type { ActivityType } from "@/types/activity";

export interface ActivityTypeConfig {
  id: ActivityType;
  label: string;
  badgeClassName: string;
  dotClassName: string;
}

export const ACTIVITY_TYPES: ActivityTypeConfig[] = [
  {
    id: "ligacao",
    label: "Ligação",
    badgeClassName: "border-blue-500/30 bg-blue-500/15 text-blue-400",
    dotClassName: "bg-blue-400",
  },
  {
    id: "email",
    label: "E-mail",
    badgeClassName: "border-violet-500/30 bg-violet-500/15 text-violet-400",
    dotClassName: "bg-violet-400",
  },
  {
    id: "reuniao",
    label: "Reunião",
    badgeClassName: "border-amber-500/30 bg-amber-500/15 text-amber-400",
    dotClassName: "bg-amber-400",
  },
  {
    id: "nota",
    label: "Nota",
    badgeClassName: "border-slate-500/30 bg-slate-500/15 text-slate-300",
    dotClassName: "bg-slate-400",
  },
];

export const ACTIVITY_TYPE_MAP: Record<ActivityType, ActivityTypeConfig> = Object.fromEntries(
  ACTIVITY_TYPES.map((type) => [type.id, type])
) as Record<ActivityType, ActivityTypeConfig>;

export const ACTIVITY_TYPE_IDS = ACTIVITY_TYPES.map((type) => type.id) as [
  ActivityType,
  ...ActivityType[],
];
