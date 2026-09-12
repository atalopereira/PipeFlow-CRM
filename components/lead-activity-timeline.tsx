import { Mail, MessageSquare, Phone, StickyNote } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { UserAvatar } from "@/components/user-avatar";
import { ACTIVITY_TYPE_MAP } from "@/lib/constants/activity-type";
import { cn, formatDateTimeShort } from "@/lib/utils";
import type { Activity, ActivityType } from "@/types/activity";

const ACTIVITY_TYPE_ICON: Record<ActivityType, typeof Phone> = {
  ligacao: Phone,
  email: Mail,
  reuniao: MessageSquare,
  nota: StickyNote,
};

interface LeadActivityTimelineProps {
  activities: Activity[];
}

export function LeadActivityTimeline({ activities }: LeadActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <EmptyState
        icon={StickyNote}
        title="Nenhuma atividade registrada"
        description="As atividades desse lead aparecerão aqui."
      />
    );
  }

  const sorted = [...activities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <ol className="flex flex-col gap-5">
      {sorted.map((activity, index) => {
        const Icon = ACTIVITY_TYPE_ICON[activity.type];
        const config = ACTIVITY_TYPE_MAP[activity.type];
        return (
          <li key={activity.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                  config.badgeClassName
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              {index < sorted.length - 1 ? <div className="mt-1 w-px flex-1 bg-border" /> : null}
            </div>
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-start justify-between gap-x-3">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {config.label}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDateTimeShort(activity.date)}
                </span>
              </div>
              <p className="mt-0.5 text-sm font-semibold">{activity.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <UserAvatar name={activity.author} className="h-5 w-5" />
                <span className="text-xs text-muted-foreground">{activity.author}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
