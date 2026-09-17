import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/4 h-72 w-72 animate-pulse rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-1/4 top-16 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl [animation-delay:1s]" />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center duration-300 animate-in fade-in-0 slide-in-from-bottom-1 sm:py-28">
        <p className="font-mono text-sm uppercase tracking-widest text-primary">
          {"// CRM para times de vendas"}
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Vendas em <span className="text-primary">fluxo contínuo</span>.
          <br />
          Sem fricção. Sem complicação.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Pipeline visual, gestão de leads e relatórios. Tudo que o seu time precisa em um lugar só.
        </p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button size="lg" className="w-full sm:w-auto" asChild>
            <Link href="/signup">
              Criar conta grátis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="#funcionalidades">Ver demonstração</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
