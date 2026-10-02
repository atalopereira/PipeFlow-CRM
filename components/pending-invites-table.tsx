"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WorkspaceRoleBadge } from "@/components/workspace-role-badge";
import { revokeInvite } from "@/lib/actions/workspace";
import { formatDate } from "@/lib/utils";
import type { WorkspaceInviteSummary } from "@/types/workspace";

interface PendingInvitesTableProps {
  invites: WorkspaceInviteSummary[];
}

export function PendingInvitesTable({ invites }: PendingInvitesTableProps) {
  const router = useRouter();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [revokingId, setRevokingId] = React.useState<string | null>(null);

  async function handleCopyLink(invite: WorkspaceInviteSummary) {
    const url = `${window.location.origin}/invite/${invite.token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(invite.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleRevoke(invite: WorkspaceInviteSummary) {
    setRevokingId(invite.id);
    await revokeInvite(invite.id);
    setRevokingId(null);
    router.refresh();
  }

  if (invites.length === 0) {
    return null;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>E-mail</TableHead>
          <TableHead>Papel</TableHead>
          <TableHead>Convidado em</TableHead>
          <TableHead>Expira em</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {invites.map((invite) => (
          <TableRow key={invite.id}>
            <TableCell className="whitespace-nowrap">{invite.email}</TableCell>
            <TableCell className="whitespace-nowrap">
              <WorkspaceRoleBadge role={invite.role} />
            </TableCell>
            <TableCell className="whitespace-nowrap text-muted-foreground">
              {formatDate(invite.createdAt)}
            </TableCell>
            <TableCell className="whitespace-nowrap text-muted-foreground">
              {formatDate(invite.expiresAt)}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={revokingId === invite.id}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Ações</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => void handleCopyLink(invite)}>
                    {copiedId === invite.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copiedId === invite.id ? "Link copiado" : "Copiar link"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => void handleRevoke(invite)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Revogar convite
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
