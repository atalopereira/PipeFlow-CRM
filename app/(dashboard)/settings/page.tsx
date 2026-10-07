import { CheckCircle2, Settings, UserPlus } from "lucide-react";

import { BillingActions } from "@/components/billing-actions";
import { EmptyState } from "@/components/empty-state";
import { InviteMemberDialog } from "@/components/invite-member-dialog";
import { PageHeader } from "@/components/page-header";
import { PendingInvitesTable } from "@/components/pending-invites-table";
import { TeamMembersTable } from "@/components/team-members-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkspaceRoleBadge } from "@/components/workspace-role-badge";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { getPendingInvites, getWorkspaceMembers } from "@/lib/workspace-members";
import type { WorkspaceRole } from "@/lib/constants/workspace-role";

const SUBSCRIPTION_STATUS_LABEL: Record<string, string> = {
  active: "Ativa",
  trialing: "Em teste",
  past_due: "Pagamento pendente",
  canceled: "Cancelada",
  inactive: "Inativa",
};

interface SettingsPageProps {
  searchParams: { checkout?: string };
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId(supabase);

  if (!workspaceId) {
    return (
      <div className="flex flex-col gap-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-1">
        <PageHeader title="Configurações" description="Preferências do workspace e da conta." />
        <EmptyState
          icon={Settings}
          title="Nenhum workspace encontrado"
          description="Crie ou entre em um workspace para ver as configurações."
        />
      </div>
    );
  }

  const [
    { data: workspace },
    {
      data: { user: authUser },
    },
    members,
    { data: subscription },
  ] = await Promise.all([
    supabase.from("workspaces").select("name, plan").eq("id", workspaceId).single(),
    supabase.auth.getUser(),
    getWorkspaceMembers(supabase, workspaceId),
    supabase
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("workspace_id", workspaceId)
      .maybeSingle(),
  ]);

  const role: WorkspaceRole =
    members.find((member) => member.userId === authUser?.id)?.role ?? "member";
  const isAdmin = role === "admin";
  const invites = isAdmin ? await getPendingInvites(supabase, workspaceId) : [];
  const isPro = workspace?.plan === "pro";

  return (
    <div className="flex flex-col gap-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-1">
      <PageHeader title="Configurações" description="Preferências do workspace e da conta." />

      {searchParams.checkout === "success" ? (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Assinatura Pro ativada</AlertTitle>
          <AlertDescription>
            Seu pagamento foi confirmado. Pode levar alguns segundos para o plano atualizar aqui.
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">{workspace?.name ?? "Workspace"}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            Plano {isPro ? "Pro" : "Free"} · Seu papel: <WorkspaceRoleBadge role={role} />
          </CardDescription>
        </CardHeader>
        {isAdmin ? (
          <CardFooter className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {isPro && subscription
                ? `${SUBSCRIPTION_STATUS_LABEL[subscription.status] ?? subscription.status}${
                    subscription.current_period_end
                      ? ` · renova em ${formatDate(subscription.current_period_end)}`
                      : ""
                  }`
                : "Plano Free: até 2 colaboradores e 50 leads."}
            </p>
            <BillingActions workspaceId={workspaceId} isPro={isPro} />
          </CardFooter>
        ) : null}
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="font-display text-lg">Equipe</CardTitle>
            <CardDescription>Colaboradores com acesso a este workspace.</CardDescription>
          </div>
          {isAdmin ? (
            <InviteMemberDialog
              trigger={
                <Button>
                  <UserPlus className="h-4 w-4" />
                  Convidar colaborador
                </Button>
              }
            />
          ) : null}
        </CardHeader>
        <CardContent>
          <TeamMembersTable members={members} />
        </CardContent>
      </Card>

      {isAdmin && invites.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Convites pendentes</CardTitle>
            <CardDescription>Ainda não aceitos ou expirados em 7 dias.</CardDescription>
          </CardHeader>
          <CardContent>
            <PendingInvitesTable invites={invites} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
