export type PipelineStageId =
  | "novo_lead"
  | "contato_realizado"
  | "proposta_enviada"
  | "negociacao"
  | "fechado_ganho"
  | "fechado_perdido";

export interface PipelineStageConfig {
  id: PipelineStageId;
  label: string;
  badgeClassName: string;
  dotClassName: string;
}

export const PIPELINE_STAGES: PipelineStageConfig[] = [
  {
    id: "novo_lead",
    label: "Novo Lead",
    badgeClassName: "border-slate-500/30 bg-slate-500/15 text-slate-300",
    dotClassName: "bg-slate-400",
  },
  {
    id: "contato_realizado",
    label: "Contato Realizado",
    badgeClassName: "border-blue-500/30 bg-blue-500/15 text-blue-400",
    dotClassName: "bg-blue-400",
  },
  {
    id: "proposta_enviada",
    label: "Proposta Enviada",
    badgeClassName: "border-amber-500/30 bg-amber-500/15 text-amber-400",
    dotClassName: "bg-amber-400",
  },
  {
    id: "negociacao",
    label: "Negociação",
    badgeClassName: "border-violet-500/30 bg-violet-500/15 text-violet-400",
    dotClassName: "bg-violet-400",
  },
  {
    id: "fechado_ganho",
    label: "Fechado Ganho",
    badgeClassName: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
    dotClassName: "bg-emerald-400",
  },
  {
    id: "fechado_perdido",
    label: "Fechado Perdido",
    badgeClassName: "border-red-500/30 bg-red-500/15 text-red-400",
    dotClassName: "bg-red-400",
  },
];

export const PIPELINE_STAGE_MAP: Record<PipelineStageId, PipelineStageConfig> =
  Object.fromEntries(PIPELINE_STAGES.map((stage) => [stage.id, stage])) as Record<
    PipelineStageId,
    PipelineStageConfig
  >;
