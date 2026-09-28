"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  Mail,
  Pencil,
  Phone,
  Plus,
  Trash2,
  User,
  type LucideIcon,
} from "lucide-react";

import { ActivityFormDialog } from "@/components/activity-form-dialog";
import type { ActivityFormValues } from "@/components/activity-form";
import { DeleteLeadDialog } from "@/components/delete-lead-dialog";
import { LeadActivityTimeline } from "@/components/lead-activity-timeline";
import { LeadFormDialog } from "@/components/lead-form-dialog";
import { LeadStatusBadge } from "@/components/lead-status-badge";
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useWorkspace } from "@/components/workspace-provider";
import { createActivity } from "@/lib/actions/activities";
import { formatCurrency, formatDateLong, getInitials } from "@/lib/utils";
import type { Activity } from "@/types/activity";
import type { Lead } from "@/types/lead";

interface ProfileFieldProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function ProfileField({ icon: Icon, label, value }: ProfileFieldProps) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="break-words text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

interface LeadDetailViewProps {
  lead: Lead;
  activities: Activity[];
}

export function LeadDetailView({ lead, activities: initialActivities }: LeadDetailViewProps) {
  const router = useRouter();
  const { currentWorkspace } = useWorkspace();
  const [activities, setActivities] = React.useState<Activity[]>(initialActivities);

  React.useEffect(() => {
    setActivities(initialActivities);
  }, [initialActivities]);

  const addActivity = React.useCallback(
    async (leadId: string, input: ActivityFormValues): Promise<{ error?: string }> => {
      const result = await createActivity(currentWorkspace.id, leadId, input);
      if (result.error) {
        return { error: result.error };
      }
      router.refresh();
      return {};
    },
    [currentWorkspace.id, router]
  );

  return (
    <div className="flex flex-col gap-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-1">
      <PageHeader
        title={lead.name}
        description={lead.company}
        actions={
          <div className="flex items-center gap-2">
            <LeadFormDialog
              mode="edit"
              lead={lead}
              trigger={
                <Button variant="outline">
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
              }
            />
            <DeleteLeadDialog
              lead={lead}
              trigger={
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </Button>
              }
              onDeleted={() => router.push("/leads")}
            />
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center gap-1 pt-6 text-center">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/15 text-lg font-medium text-primary">
                {getInitials(lead.name)}
              </AvatarFallback>
            </Avatar>
            <p className="mt-2 font-semibold">{lead.name}</p>
            {lead.role ? <p className="text-sm text-muted-foreground">{lead.role}</p> : null}
            <p className="text-sm text-muted-foreground">{lead.company}</p>
            <div className="mt-2">
              <LeadStatusBadge statusId={lead.statusId} />
            </div>
          </CardContent>

          <Separator />

          <CardContent className="space-y-4 pt-6 text-sm">
            <ProfileField icon={Mail} label="E-mail" value={lead.email} />
            <ProfileField icon={Phone} label="Telefone" value={lead.phone} />
            <ProfileField icon={Building2} label="Empresa" value={lead.company} />
            <ProfileField icon={Briefcase} label="Cargo" value={lead.role || "—"} />
          </CardContent>

          <Separator />

          <CardContent className="space-y-4 pt-6 text-sm">
            {lead.estimatedValue ? (
              <ProfileField
                icon={DollarSign}
                label="Valor estimado"
                value={formatCurrency(lead.estimatedValue)}
              />
            ) : null}
            <ProfileField icon={User} label="Responsável" value={lead.owner.name} />
            <ProfileField
              icon={Calendar}
              label="Criado em"
              value={formatDateLong(lead.createdAt)}
            />
          </CardContent>

          {lead.notes ? (
            <>
              <Separator />
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">Notas</p>
                <p className="mt-1 text-sm">{lead.notes}</p>
              </CardContent>
            </>
          ) : null}
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="font-display text-base">
              Atividades ({activities.length})
            </CardTitle>
            <ActivityFormDialog
              leadId={lead.id}
              onAddActivity={addActivity}
              trigger={
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  Registrar atividade
                </Button>
              }
            />
          </CardHeader>
          <CardContent>
            <LeadActivityTimeline activities={activities} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
