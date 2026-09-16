"use client";

import * as React from "react";

import { MOCK_DEALS } from "@/lib/mock/deals";
import { MOCK_CURRENT_USER } from "@/lib/mock/workspace";
import type { PipelineStageId } from "@/lib/constants/pipeline";
import type { Deal } from "@/types/deal";
import type { DealFormValues } from "@/components/deal-form";

interface DealsContextValue {
  deals: Deal[];
  addDeal: (input: DealFormValues) => Deal;
  moveDeal: (id: string, stageId: PipelineStageId) => void;
}

const DealsContext = React.createContext<DealsContextValue | null>(null);

export function DealsProvider({ children }: { children: React.ReactNode }) {
  const [deals, setDeals] = React.useState<Deal[]>(MOCK_DEALS);

  const addDeal = React.useCallback((input: DealFormValues): Deal => {
    const newDeal: Deal = {
      id: `deal_${crypto.randomUUID()}`,
      title: input.title,
      leadId: input.leadId,
      value: Number(input.value),
      stageId: input.stageId,
      dueDate: input.dueDate,
      owner: { name: MOCK_CURRENT_USER.name, initials: MOCK_CURRENT_USER.initials },
      createdAt: new Date().toISOString(),
    };
    setDeals((prev) => [newDeal, ...prev]);
    return newDeal;
  }, []);

  const moveDeal = React.useCallback((id: string, stageId: PipelineStageId) => {
    setDeals((prev) => prev.map((deal) => (deal.id === id ? { ...deal, stageId } : deal)));
  }, []);

  const value = React.useMemo(() => ({ deals, addDeal, moveDeal }), [deals, addDeal, moveDeal]);

  return <DealsContext.Provider value={value}>{children}</DealsContext.Provider>;
}

export function useDeals(): DealsContextValue {
  const context = React.useContext(DealsContext);
  if (!context) {
    throw new Error("useDeals must be used within a DealsProvider");
  }
  return context;
}
