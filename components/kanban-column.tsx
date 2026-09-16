"use client";

import * as React from "react";
import { useDroppable } from "@dnd-kit/core";

import { DealCard } from "@/components/deal-card";
import { cn, formatCurrency } from "@/lib/utils";
import type { PipelineStageConfig } from "@/lib/constants/pipeline";
import type { Deal } from "@/types/deal";

// Tailwind's content scanner only picks up literal class strings present in
// source — a computed template literal like `[animation-delay:${i * 80}ms]`
// would never be generated. Hardcode one entry per column index instead,
// same reason the dashboard page hardcodes 0/100/200/300ms per StatCard.
const STAGGER_DELAY_CLASSNAME = [
  "[animation-delay:0ms]",
  "[animation-delay:80ms]",
  "[animation-delay:160ms]",
  "[animation-delay:240ms]",
  "[animation-delay:320ms]",
  "[animation-delay:400ms]",
] as const;

interface KanbanColumnProps {
  stage: PipelineStageConfig;
  deals: Deal[];
  index: number;
}

export function KanbanColumn({ stage, deals, index }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const totalValue = React.useMemo(() => deals.reduce((sum, deal) => sum + deal.value, 0), [deals]);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-[300px] shrink-0 flex-col gap-3 rounded-xl border bg-card/50 p-3",
        "duration-500 animate-in fade-in-0 slide-in-from-bottom-2 [animation-fill-mode:backwards]",
        STAGGER_DELAY_CLASSNAME[index],
        isOver && "ring-2 ring-primary/40"
      )}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", stage.dotClassName)} />
          <h2 className="text-sm font-medium">{stage.label}</h2>
        </div>
        <span className="text-xs text-muted-foreground">{deals.length}</span>
      </div>
      <p className="px-1 font-display text-lg font-semibold tracking-tight">
        {formatCurrency(totalValue)}
      </p>
      <div className="flex min-h-[160px] flex-col gap-2">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
        {deals.length === 0 ? (
          <p className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
            Nenhum negócio nesta etapa
          </p>
        ) : null}
      </div>
    </div>
  );
}
