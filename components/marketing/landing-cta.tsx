import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LandingCta() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      <Card className="mx-auto flex max-w-3xl flex-col items-center gap-6 border-primary/30 px-6 py-16 text-center sm:px-16">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          Pronto para organizar seu funil de vendas?
        </h2>
        <p className="text-muted-foreground">
          Crie sua conta grátis em minutos e comece a gerenciar leads, negócios e atividades da sua
          equipe hoje mesmo.
        </p>
        <Button size="lg" asChild>
          <Link href="/signup">
            Começar grátis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          Grátis para até 2 colaboradores e 50 leads. Sem cartão de crédito.
        </p>
      </Card>
    </section>
  );
}
