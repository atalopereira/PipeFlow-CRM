import type { CurrentUser, Workspace } from "@/types/workspace";

export const MOCK_WORKSPACES: Workspace[] = [
  { id: "ws_acme", name: "Acme Vendas", plan: "pro" },
  { id: "ws_nimbus", name: "Nimbus Tech", plan: "free" },
  { id: "ws_orbita", name: "Órbita Consultoria", plan: "free" },
];

export const MOCK_CURRENT_WORKSPACE_ID: string = MOCK_WORKSPACES[0].id;

export const MOCK_CURRENT_USER: CurrentUser = {
  name: "Atalo Araujo",
  email: "atalo@acmevendas.com",
  initials: "AA",
};
