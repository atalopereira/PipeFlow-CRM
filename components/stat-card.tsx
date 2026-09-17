import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardTrend {
  value: number;
  direction: "up" | "down";
}

interface StatCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  iconClassName?: string;
  trend?: StatCardTrend;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="flex items-start justify-between p-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-display text-3xl font-semibold tracking-tight">{value}</p>
          {trend ? (
            <div className="flex items-center gap-1 pt-1 text-xs">
              {trend.direction === "up" ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-400" />
              )}
              <span
                className={cn(
                  "font-medium",
                  trend.direction === "up" ? "text-emerald-400" : "text-red-400"
                )}
              >
                {trend.direction === "up" ? "+" : "-"}
                {trend.value}%
              </span>
              <span className="text-muted-foreground">vs mês anterior</span>
            </div>
          ) : null}
        </div>
        {Icon ? (
          <div className={cn("rounded-lg p-2", iconClassName ?? "bg-primary/10 text-primary")}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
