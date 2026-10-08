import { AlertTriangle, CreditCard, Settings, UserPlus } from "lucide-react";
import Link from "next/link";

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
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { canAddMember } from "@/lib/limits";
import { getPendingInvites, getWorkspaceMembers } from "@/lib/workspace-members";
import type { WorkspaceRole } from "@/lib/constants/workspace-role";

export default async function SettingsPage() {
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
  ] = await Promise.all([
    supabase.from("workspaces").select("name, plan").eq("id", workspaceId).single(),
    supabase.auth.getUser(),
    getWorkspaceMembers(supabase, workspaceId),
  ]);

  const role: WorkspaceRole =
    members.find((member) => member.userId === authUser?.id)?.role ?? "member";
  const isAdmin = role === "admin";
  const invites = isAdmin ? await getPendingInvites(supabase, workspaceId) : [];
  const plan = workspace?.plan ?? "free";
  const memberLimit = canAddMember(plan, members.length + invites.length);

  return (
    <div className="flex flex-col gap-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-1">
      <PageHeader title="Configurações" description="Preferências do workspace e da conta." />

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">{workspace?.name ?? "Workspace"}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            Plano {plan === "pro" ? "Pro" : "Free"} · Seu papel: <WorkspaceRoleBadge role={role} />
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href="/settings/billing">
              <CreditCard className="h-4 w-4" />
              Ver plano e cobrança
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="font-display text-lg">Equipe</CardTitle>
            <CardDescription>Colaboradores com acesso a este workspace.</CardDescription>
          </div>
          {isAdmin ? (
            memberLimit.allowed ? (
              <InviteMemberDialog
                trigger={
                  <Button>
                    <UserPlus className="h-4 w-4" />
                    Convidar colaborador
                  </Button>
                }
              />
            ) : (
              <Button disabled title="Limite do plano Free atingido">
                <UserPlus className="h-4 w-4" />
                Convidar colaborador
              </Button>
            )
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {isAdmin && !memberLimit.allowed ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Limite de colaboradores do plano Free atingido</AlertTitle>
              <AlertDescription>
                Você já tem {memberLimit.current} de {memberLimit.limit} colaboradores (incluindo
                convites pendentes) permitidos no plano Free.{" "}
                <Link href="/settings/billing" className="font-medium underline underline-offset-4">
                  Faça upgrade para o Pro
                </Link>{" "}
                para convidar mais pessoas.
              </AlertDescription>
            </Alert>
          ) : null}
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
