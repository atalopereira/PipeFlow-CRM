"use client";

import * as React from "react";
import { CreditCard, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createCheckoutSession, createPortalSession } from "@/lib/actions/billing";

interface BillingActionsProps {
  workspaceId: string;
  isPro: boolean;
}

export function BillingActions({ workspaceId, isPro }: BillingActionsProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    const action = isPro ? createPortalSession : createCheckoutSession;
    const result = await action(workspaceId);

    setLoading(false);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button onClick={() => void handleClick()} disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CreditCard className="h-4 w-4" />
        )}
        {isPro ? "Gerenciar assinatura" : "Assinar Pro"}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
