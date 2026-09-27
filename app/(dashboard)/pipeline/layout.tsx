import type { ReactNode } from "react";

import { DealsProvider } from "@/components/deals-provider";
import { getDeals } from "@/lib/deals";
import { getLeads } from "@/lib/leads";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceId } from "@/lib/workspace";

export default async function PipelineLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId(supabase);

  const [deals, leads] = workspaceId
    ? await Promise.all([getDeals(supabase, workspaceId), getLeads(supabase, workspaceId)])
    : [[], []];

  return (
    <DealsProvider initialDeals={deals} leads={leads}>
      {children}
    </DealsProvider>
  );
}
