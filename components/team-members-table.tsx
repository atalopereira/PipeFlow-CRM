"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut, MoreHorizontal, UserMinus } from "lucide-react";

import { RemoveMemberDialog } from "@/components/remove-member-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAvatar } from "@/components/user-avatar";
import { WorkspaceRoleBadge } from "@/components/workspace-role-badge";
import { useWorkspace } from "@/components/workspace-provider";
import { updateMemberRole } from "@/lib/actions/workspace";
import { WORKSPACE_ROLES, type WorkspaceRole } from "@/lib/constants/workspace-role";
import { formatDate } from "@/lib/utils";
import type { WorkspaceMemberSummary } from "@/types/workspace";

interface TeamMembersTableProps {
  members: WorkspaceMemberSummary[];
}

export function TeamMembersTable({ members }: TeamMembersTableProps) {
  const router = useRouter();
  const { user, currentWorkspace } = useWorkspace();
  const [updatingUserId, setUpdatingUserId] = React.useState<string | null>(null);
  const [removingMember, setRemovingMember] = React.useState<WorkspaceMemberSummary | null>(null);

  const isAdmin = currentWorkspace.role === "admin";
  const adminCount = members.filter((member) => member.role === "admin").length;

  async function handleRoleChange(userId: string, role: WorkspaceRole) {
    setUpdatingUserId(userId);
    await updateMemberRole(currentWorkspace.id, userId, role);
    setUpdatingUserId(null);
    router.refresh();
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Desde</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const isSelf = member.userId === user.id;
            const isLastAdmin = member.role === "admin" && adminCount <= 1;

            return (
              <TableRow key={member.userId}>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <UserAvatar name={member.name} initials={member.initials} />
                    <span className="font-medium">
                      {member.name}
                      {isSelf ? <span className="text-muted-foreground"> (você)</span> : null}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {member.email}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {isAdmin ? (
                    <Select
                      value={member.role}
                      disabled={updatingUserId === member.userId || isLastAdmin}
                      onValueChange={(value) =>
                        void handleRoleChange(member.userId, value as WorkspaceRole)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {WORKSPACE_ROLES.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <WorkspaceRoleBadge role={member.role} />
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(member.joinedAt)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {isSelf || isAdmin ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Ações</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          disabled={isLastAdmin}
                          onSelect={() => setTimeout(() => setRemovingMember(member), 0)}
                          className="text-destructive focus:text-destructive"
                        >
                          {isSelf ? (
                            <LogOut className="h-4 w-4" />
                          ) : (
                            <UserMinus className="h-4 w-4" />
                          )}
                          {isSelf ? "Sair do workspace" : "Remover"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {removingMember ? (
        <RemoveMemberDialog
          userId={removingMember.userId}
          memberName={removingMember.name}
          isSelf={removingMember.userId === user.id}
          open={Boolean(removingMember)}
          onOpenChange={(open) => {
            if (!open) setRemovingMember(null);
          }}
        />
      ) : null}
    </>
  );
}
