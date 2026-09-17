import { cn } from "@/lib/utils";

const STATS = [
  { value: "+47%", label: "Conversão" },
  { value: "3.2X", label: "Mais leads" },
  { value: "-62%", label: "Ciclo de venda" },
  { value: "1.200+", label: "Times ativos" },
];

function dividerClasses(index: number): string {
  return cn(
    "border-border",
    index % 2 === 0 ? "border-r" : "border-r-0",
    index < 2 ? "border-b" : "border-b-0",
    "sm:border-b-0",
    index < STATS.length - 1 ? "sm:border-r" : "sm:border-r-0"
  );
}

export function LandingStats() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <div className="grid grid-cols-2 rounded-xl border bg-card sm:grid-cols-4">
        {STATS.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "flex flex-col items-center gap-1 px-6 py-8 text-center",
              dividerClasses(index)
            )}
          >
            <span className="font-display text-3xl font-extrabold text-primary sm:text-4xl">
              {stat.value}
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
