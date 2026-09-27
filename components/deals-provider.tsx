"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useWorkspace } from "@/components/workspace-provider";
import { createDeal, updateDealStage } from "@/lib/actions/deals";
import type { PipelineStageId } from "@/lib/constants/pipeline";
import type { Deal } from "@/types/deal";
import type { Lead } from "@/types/lead";
import type { DealFormValues } from "@/components/deal-form";

interface DealActionResult {
  error?: string;
}

interface DealsContextValue {
  deals: Deal[];
  leads: Lead[];
  addDeal: (input: DealFormValues) => Promise<DealActionResult>;
  moveDeal: (id: string, stageId: PipelineStageId) => void;
}

const DealsContext = React.createContext<DealsContextValue | null>(null);

interface DealsProviderProps {
  initialDeals: Deal[];
  leads: Lead[];
  children: React.ReactNode;
}

export function DealsProvider({ initialDeals, leads, children }: DealsProviderProps) {
  const router = useRouter();
  const { currentWorkspace } = useWorkspace();
  const [deals, setDeals] = React.useState<Deal[]>(initialDeals);

  React.useEffect(() => {
    setDeals(initialDeals);
  }, [initialDeals]);

  const addDeal = React.useCallback(
    async (input: DealFormValues): Promise<DealActionResult> => {
      const result = await createDeal(currentWorkspace.id, input);
      if (result.error) {
        return { error: result.error };
      }
      router.refresh();
      return {};
    },
    [currentWorkspace.id, router]
  );

  const moveDeal = React.useCallback(
    (id: string, stageId: PipelineStageId) => {
      const previousStageId = deals.find((deal) => deal.id === id)?.stageId;
      setDeals((prev) => prev.map((deal) => (deal.id === id ? { ...deal, stageId } : deal)));

      void updateDealStage(currentWorkspace.id, id, stageId).then((result) => {
        if (result.error && previousStageId) {
          setDeals((prev) =>
            prev.map((deal) => (deal.id === id ? { ...deal, stageId: previousStageId } : deal))
          );
        }
      });
    },
    [deals, currentWorkspace.id]
  );

  const value = React.useMemo(
    () => ({ deals, leads, addDeal, moveDeal }),
    [deals, leads, addDeal, moveDeal]
  );

  return <DealsContext.Provider value={value}>{children}</DealsContext.Provider>;
}

export function useDeals(): DealsContextValue {
  const context = React.useContext(DealsContext);
  if (!context) {
    throw new Error("useDeals must be used within a DealsProvider");
  }
  return context;
}
