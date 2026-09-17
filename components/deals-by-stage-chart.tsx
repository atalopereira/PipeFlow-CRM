"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StageFunnelDatum } from "@/lib/metrics";
import { formatCurrency } from "@/lib/utils";

interface DealsByStageChartProps {
  data: StageFunnelDatum[];
}

interface StageTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: StageFunnelDatum }>;
}

function StageTooltip({ active, payload }: StageTooltipProps) {
  if (!active || !payload?.length) return null;
  const stage = payload[0].payload;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{stage.label}</p>
      <p className="text-muted-foreground">
        {stage.count} negócio{stage.count === 1 ? "" : "s"} · {formatCurrency(stage.value)}
      </p>
    </div>
  );
}

export function DealsByStageChart({ data }: DealsByStageChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base">Negócios por etapa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={32}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <Tooltip content={<StageTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={64}>
                {data.map((entry) => (
                  <Cell key={entry.stageId} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
