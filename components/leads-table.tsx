"use client";

import * as React from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Search, Trash2, Users } from "lucide-react";

import { DeleteLeadDialog } from "@/components/delete-lead-dialog";
import { EmptyState } from "@/components/empty-state";
import { LeadFormDialog } from "@/components/lead-form-dialog";
import { LeadStatusBadge } from "@/components/lead-status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { LEAD_STATUSES } from "@/lib/constants/lead-status";
import { formatDate } from "@/lib/utils";
import type { Lead } from "@/types/lead";

type StatusFilter = "todos" | Lead["statusId"];

interface LeadsTableProps {
  leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("todos");
  const [editingLead, setEditingLead] = React.useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = React.useState<Lead | null>(null);

  const filteredLeads = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesSearch =
        query.length === 0 ||
        lead.name.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "todos" || lead.statusId === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou empresa..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {LEAD_STATUSES.map((status) => (
              <SelectItem key={status.id} value={status.id}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredLeads.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum lead encontrado"
          description="Ajuste a busca ou os filtros para ver outros resultados."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="whitespace-nowrap">
                  <Link href={`/leads/${lead.id}`} className="hover:underline">
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-xs text-muted-foreground">{lead.email}</div>
                  </Link>
                </TableCell>
                <TableCell className="whitespace-nowrap">{lead.company}</TableCell>
                <TableCell className="whitespace-nowrap">{lead.role || "—"}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <LeadStatusBadge statusId={lead.statusId} />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <UserAvatar name={lead.owner.name} initials={lead.owner.initials} />
                    <span className="text-sm">{lead.owner.name}</span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(lead.createdAt)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Ações</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => setTimeout(() => setEditingLead(lead), 0)}>
                        <Pencil className="h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setTimeout(() => setDeletingLead(lead), 0)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {editingLead ? (
        <LeadFormDialog
          mode="edit"
          lead={editingLead}
          open={Boolean(editingLead)}
          onOpenChange={(open) => {
            if (!open) setEditingLead(null);
          }}
        />
      ) : null}

      {deletingLead ? (
        <DeleteLeadDialog
          lead={deletingLead}
          open={Boolean(deletingLead)}
          onOpenChange={(open) => {
            if (!open) setDeletingLead(null);
          }}
          onDeleted={() => setDeletingLead(null)}
        />
      ) : null}
    </div>
  );
}
