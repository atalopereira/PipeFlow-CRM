import Link from "next/link";
import { UserX } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { LeadDetailView } from "@/components/lead-detail-view";
import { Button } from "@/components/ui/button";
import { getActivitiesForLead } from "@/lib/activities";
import { getLeadById } from "@/lib/leads";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceId } from "@/lib/workspace";

interface LeadDetailPageProps {
  params: { id: string };
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId(supabase);
  const lead = workspaceId ? await getLeadById(supabase, workspaceId, params.id) : null;

  if (!lead) {
    return (
      <EmptyState
        icon={UserX}
        title="Lead não encontrado"
        description="Esse lead pode ter sido removido ou o link está incorreto."
        action={
          <Button asChild>
            <Link href="/leads">Voltar para leads</Link>
          </Button>
        }
      />
    );
  }

  const activities = await getActivitiesForLead(supabase, workspaceId!, lead.id);

  return <LeadDetailView lead={lead} activities={activities} />;
}
