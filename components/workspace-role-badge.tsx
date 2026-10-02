import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WORKSPACE_ROLE_MAP, type WorkspaceRole } from "@/lib/constants/workspace-role";

interface WorkspaceRoleBadgeProps {
  role: WorkspaceRole;
  className?: string;
}

export function WorkspaceRoleBadge({ role, className }: WorkspaceRoleBadgeProps) {
  const config = WORKSPACE_ROLE_MAP[role];

  return (
    <Badge variant="outline" className={cn(config.badgeClassName, className)}>
      {config.label}
    </Badge>
  );
}
