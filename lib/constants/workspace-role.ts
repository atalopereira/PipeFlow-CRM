export type WorkspaceRole = "admin" | "member";

export interface WorkspaceRoleConfig {
  id: WorkspaceRole;
  label: string;
  badgeClassName: string;
}

export const WORKSPACE_ROLES: WorkspaceRoleConfig[] = [
  {
    id: "admin",
    label: "Admin",
    badgeClassName: "border-primary/30 bg-primary/15 text-primary",
  },
  {
    id: "member",
    label: "Membro",
    badgeClassName: "border-border bg-secondary/60 text-foreground",
  },
];

export const WORKSPACE_ROLE_MAP: Record<WorkspaceRole, WorkspaceRoleConfig> = Object.fromEntries(
  WORKSPACE_ROLES.map((role) => [role.id, role])
) as Record<WorkspaceRole, WorkspaceRoleConfig>;
