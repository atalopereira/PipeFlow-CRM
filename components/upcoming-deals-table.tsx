import { ArrowRight, CalendarClock } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { StageBadge } from "@/components/stage-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAvatar } from "@/components/user-avatar";
import { isDealOverdue } from "@/lib/metrics";
import { getMockLeadById } from "@/lib/mock/leads";
import { cn, formatCurrency, formatDateOnly } from "@/lib/utils";
import type { Deal } from "@/types/deal";

interface UpcomingDealsTableProps {
  deals: Deal[];
  today: string;
}

export function UpcomingDealsTable({ deals, today }: UpcomingDealsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base">Negócios com prazo próximo</CardTitle>
      </CardHeader>
      <CardContent>
        {deals.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="Nenhum negócio com prazo próximo"
            description="Negócios abertos com data de fechamento aparecem aqui."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Negócio</TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Prazo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => {
                const lead = getMockLeadById(deal.leadId);
                const overdue = isDealOverdue(deal.dueDate, today);
                return (
                  <TableRow key={deal.id} className="group">
                    <TableCell className="whitespace-nowrap font-medium">
                      <Link
                        href="/pipeline"
                        className="flex items-center gap-1.5 hover:text-primary hover:underline"
                      >
                        {deal.title}
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {lead?.name ?? "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <StageBadge stageId={deal.stageId} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-display">
                      {formatCurrency(deal.value)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          name={deal.owner.name}
                          initials={deal.owner.initials}
                          className="h-6 w-6"
                        />
                        <span className="text-sm">{deal.owner.name.split(" ")[0]}</span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div
                        className={cn(
                          "flex items-center gap-1.5",
                          overdue ? "text-red-400" : "text-muted-foreground"
                        )}
                      >
                        {formatDateOnly(deal.dueDate)}
                        {overdue ? (
                          <Badge
                            variant="outline"
                            className="border-red-500/30 bg-red-500/15 text-red-400"
                          >
                            Vencido
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
