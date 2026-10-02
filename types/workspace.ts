import type { WorkspaceRole } from "@/lib/constants/workspace-role";

export type WorkspacePlan = "free" | "pro";

export interface Workspace {
  id: string;
  name: string;
  plan: WorkspacePlan;
}

export interface CurrentUser {
  name: string;
  email: string;
  initials: string;
}

export interface WorkspaceMemberSummary {
  userId: string;
  name: string;
  email: string;
  initials: string;
  role: WorkspaceRole;
  joinedAt: string;
}

export interface WorkspaceInviteSummary {
  id: string;
  email: string;
  role: WorkspaceRole;
  createdAt: string;
  expiresAt: string;
  token: string;
}
