"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import { DealCardView } from "@/components/deal-card";
import { KanbanColumn } from "@/components/kanban-column";
import { useDeals } from "@/components/deals-provider";
import { PIPELINE_STAGES, type PipelineStageId } from "@/lib/constants/pipeline";
import type { Deal } from "@/types/deal";

export function KanbanBoard() {
  const { deals, moveDeal } = useDeals();
  const [activeDeal, setActiveDeal] = React.useState<Deal | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const dealsByStage = React.useMemo(() => {
    const grouped = new Map<PipelineStageId, Deal[]>();
    for (const stage of PIPELINE_STAGES) {
      grouped.set(stage.id, []);
    }
    for (const deal of deals) {
      grouped.get(deal.stageId)?.push(deal);
    }
    return grouped;
  }, [deals]);

  function handleDragStart(event: DragStartEvent) {
    setActiveDeal(deals.find((deal) => deal.id === event.active.id) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveDeal(null);
    if (!over) return;
    const targetStageId = over.id as PipelineStageId;
    const deal = deals.find((d) => d.id === active.id);
    if (deal && deal.stageId !== targetStageId) {
      moveDeal(deal.id, targetStageId);
    }
  }

  return (
    <DndContext
      id="kanban-board"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto pb-2">
        <div className="flex gap-4">
          {PIPELINE_STAGES.map((stage, index) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              deals={dealsByStage.get(stage.id) ?? []}
              index={index}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeDeal ? (
          <DealCardView deal={activeDeal} className="rotate-2 cursor-grabbing shadow-lg" />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
