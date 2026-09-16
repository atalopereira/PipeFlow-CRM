"use client";

import * as React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CalendarDays } from "lucide-react";

import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { PIPELINE_STAGE_MAP } from "@/lib/constants/pipeline";
import { getMockLeadById } from "@/lib/mock/leads";
import { cn, formatCurrency, formatDateOnly } from "@/lib/utils";
import type { Deal } from "@/types/deal";

interface DealCardViewProps extends React.ComponentPropsWithoutRef<typeof Card> {
  deal: Deal;
}

export const DealCardView = React.forwardRef<HTMLDivElement, DealCardViewProps>(
  ({ deal, className, ...props }, ref) => {
    const lead = getMockLeadById(deal.leadId);
    const stage = PIPELINE_STAGE_MAP[deal.stageId];

    return (
      <Card
        ref={ref}
        className={cn(
          "border bg-card p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5",
          stage.hoverClassName,
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium leading-snug">{deal.title}</p>
          {lead ? (
            <p className="truncate text-xs text-muted-foreground">
              {lead.name} · {lead.company}
            </p>
          ) : null}
          <p className="font-display text-base font-semibold tracking-tight">
            {formatCurrency(deal.value)}
          </p>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <UserAvatar
                name={deal.owner.name}
                initials={deal.owner.initials}
                className="h-6 w-6"
              />
              <span className="text-xs text-muted-foreground">{deal.owner.name.split(" ")[0]}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDateOnly(deal.dueDate)}
            </div>
          </div>
        </div>
      </Card>
    );
  }
);
DealCardView.displayName = "DealCardView";

interface DealCardProps {
  deal: Deal;
}

export function DealCard({ deal }: DealCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: deal.id });

  return (
    <DealCardView
      deal={deal}
      ref={setNodeRef}
      className={cn("cursor-grab touch-none active:cursor-grabbing", isDragging && "opacity-40")}
      {...listeners}
      {...attributes}
    />
  );
}
