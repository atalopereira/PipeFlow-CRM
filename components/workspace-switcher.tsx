"use client";

import { useState } from "react";
import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_CURRENT_WORKSPACE_ID, MOCK_WORKSPACES } from "@/lib/mock/workspace";

export function WorkspaceSwitcher() {
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(MOCK_CURRENT_WORKSPACE_ID);
  const currentWorkspace =
    MOCK_WORKSPACES.find((workspace) => workspace.id === currentWorkspaceId) ??
    MOCK_WORKSPACES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between gap-2 border-border/60 bg-secondary/40 px-3"
        >
          <span className="flex min-w-0 items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate text-sm font-medium">{currentWorkspace.name}</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Workspaces
        </DropdownMenuLabel>
        {MOCK_WORKSPACES.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onSelect={() => setCurrentWorkspaceId(workspace.id)}
            className="justify-between"
          >
            <span className="flex min-w-0 items-center gap-2">
              <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{workspace.name}</span>
              <span className="shrink-0 text-xs uppercase text-muted-foreground">
                {workspace.plan}
              </span>
            </span>
            {workspace.id === currentWorkspaceId ? (
              <Check className="h-4 w-4 shrink-0 text-primary" />
            ) : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-muted-foreground">
          <Plus className="h-4 w-4" />
          Novo workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
