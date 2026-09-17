import { Check } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PricingPlan {
  name: string;
  price: string;
  priceClassName?: string;
  features: string[];
  cta: string;
  href: string;
  buttonVariant: "outline" | "default";
  highlighted?: boolean;
}

const PLANS: PricingPlan[] = [
  {
    name: "Free",
    price: "R$ 0",
    features: ["2 membros", "50 leads", "Pipeline básico"],
    cta: "Começar grátis",
    href: "/signup",
    buttonVariant: "outline",
  },
  {
    name: "Pro",
    price: "R$ 49",
    priceClassName: "text-primary",
    features: ["Membros ilimitados", "Leads ilimitados", "Dashboard + relatórios"],
    cta: "Assinar Pro",
    href: "/signup",
    buttonVariant: "default",
    highlighted: true,
  },
];

export function LandingPricing() {
  return (
    <section id="precos" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          Planos para cada fase do seu negócio
        </h2>
        <p className="mt-4 text-muted-foreground">
          Comece de graça. Faça upgrade quando sua equipe crescer.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <Card key={plan.name} className={cn(plan.highlighted && "border-2 border-primary")}>
            <CardHeader>
              <CardTitle className="font-display text-lg">{plan.name}</CardTitle>
              <p className="pt-2">
                <span className={cn("font-display text-4xl font-bold", plan.priceClassName)}>
                  {plan.price}
                </span>
                <span className="text-base font-normal text-muted-foreground">/mês</span>
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant={plan.buttonVariant} size="lg" className="w-full" asChild>
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
