import { Check, CheckCircle2, Settings } from "lucide-react";
import Link from "next/link";

import { BillingActions } from "@/components/billing-actions";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLeadCount } from "@/lib/leads";
import { canAddLead, canAddMember } from "@/lib/limits";
import { cn, formatDate } from "@/lib/utils";
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

interface PlanColumn {
  id: "free" | "pro";
  name: string;
  price: string;
  features: string[];
}

const PLAN_COLUMNS: PlanColumn[] = [
  {
    id: "free",
    name: "Free",
    price: "R$ 0/mês",
    features: ["Até 2 colaboradores", "Até 50 leads", "Pipeline básico"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 49/mês",
    features: ["Colaboradores ilimitados", "Leads ilimitados", "Dashboard + relatórios"],
  },
];

interface BillingPageProps {
  searchParams: { checkout?: string };
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const supabase = await createClient();
  const workspaceId = await getCurrentWorkspaceId(supabase);

  if (!workspaceId) {
    return (
      <div className="flex flex-col gap-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-1">
        <PageHeader title="Plano e cobrança" description="Gerencie a assinatura do workspace." />
        <EmptyState
          icon={Settings}
          title="Nenhum workspace encontrado"
          description="Crie ou entre em um workspace para ver a cobrança."
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
  const plan = workspace?.plan ?? "free";
  const isPro = plan === "pro";

  const [invites, leadCount] = await Promise.all([
    isAdmin ? getPendingInvites(supabase, workspaceId) : Promise.resolve([]),
    getLeadCount(supabase, workspaceId),
  ]);

  const leadLimit = canAddLead(plan, leadCount);
  const memberLimit = canAddMember(plan, members.length + invites.length);

  return (
    <div className="flex flex-col gap-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-1">
      <PageHeader
        title="Plano e cobrança"
        description="Gerencie a assinatura do workspace."
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/settings">Voltar para configurações</Link>
          </Button>
        }
      />

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
          <CardTitle className="font-display text-lg">
            Plano atual: {isPro ? "Pro" : "Free"}
          </CardTitle>
          <CardDescription>
            {isPro && subscription
              ? `${SUBSCRIPTION_STATUS_LABEL[subscription.status] ?? subscription.status}${
                  subscription.current_period_end
                    ? ` · renova em ${formatDate(subscription.current_period_end)}`
                    : ""
                }`
              : "Faça upgrade para remover os limites do plano Free."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
          <p>
            Leads: {leadLimit.current}
            {leadLimit.limit !== null ? ` / ${leadLimit.limit}` : " (ilimitado)"}
          </p>
          <p>
            Colaboradores: {memberLimit.current}
            {memberLimit.limit !== null ? ` / ${memberLimit.limit}` : " (ilimitado)"}
          </p>
        </CardContent>
        {isAdmin ? (
          <CardFooter>
            <BillingActions workspaceId={workspaceId} isPro={isPro} />
          </CardFooter>
        ) : null}
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        {PLAN_COLUMNS.map((column) => {
          const isCurrent = column.id === plan;
          return (
            <Card key={column.id} className={cn(isCurrent && "border-2 border-primary")}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="font-display text-lg">{column.name}</CardTitle>
                  {isCurrent ? <Badge>Plano atual</Badge> : null}
                </div>
                <CardDescription className="font-display text-2xl font-bold text-foreground">
                  {column.price}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {column.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
