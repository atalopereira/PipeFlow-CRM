"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { switchWorkspace as switchWorkspaceAction } from "@/lib/actions/auth";
import type { Database } from "@/types/supabase";

export interface WorkspaceUser {
  id: string;
  name: string;
  email: string;
  initials: string;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  plan: Database["public"]["Tables"]["workspaces"]["Row"]["plan"];
  role: Database["public"]["Tables"]["workspace_members"]["Row"]["role"];
}

interface WorkspaceContextValue {
  user: WorkspaceUser;
  workspaces: WorkspaceSummary[];
  currentWorkspace: WorkspaceSummary;
  switchWorkspace: (workspaceId: string) => void;
}

const WorkspaceContext = React.createContext<WorkspaceContextValue | null>(null);

interface WorkspaceProviderProps {
  user: WorkspaceUser;
  workspaces: WorkspaceSummary[];
  currentWorkspaceId: string;
  children: React.ReactNode;
}

export function WorkspaceProvider({
  user,
  workspaces,
  currentWorkspaceId,
  children,
}: WorkspaceProviderProps) {
  const router = useRouter();

  const currentWorkspace =
    workspaces.find((workspace) => workspace.id === currentWorkspaceId) ?? workspaces[0];

  const switchWorkspace = React.useCallback(
    (workspaceId: string) => {
      void switchWorkspaceAction(workspaceId).then(() => router.refresh());
    },
    [router]
  );

  const value = React.useMemo(
    () => ({ user, workspaces, currentWorkspace, switchWorkspace }),
    [user, workspaces, currentWorkspace, switchWorkspace]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const context = React.useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
