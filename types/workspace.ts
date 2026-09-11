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
