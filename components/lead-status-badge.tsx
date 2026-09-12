import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LEAD_STATUS_MAP, type LeadStatusId } from "@/lib/constants/lead-status";

interface LeadStatusBadgeProps {
  statusId: LeadStatusId;
  className?: string;
}

export function LeadStatusBadge({ statusId, className }: LeadStatusBadgeProps) {
  const status = LEAD_STATUS_MAP[statusId];

  return (
    <Badge variant="outline" className={cn(status.badgeClassName, className)}>
      {status.label}
    </Badge>
  );
}
