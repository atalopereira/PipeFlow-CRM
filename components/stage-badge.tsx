import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PIPELINE_STAGE_MAP, type PipelineStageId } from "@/lib/constants/pipeline";

interface StageBadgeProps {
  stageId: PipelineStageId;
  className?: string;
}

export function StageBadge({ stageId, className }: StageBadgeProps) {
  const stage = PIPELINE_STAGE_MAP[stageId];

  return (
    <Badge variant="outline" className={cn(stage.badgeClassName, className)}>
      {stage.label}
    </Badge>
  );
}
