import { BarChart3, Building2, CreditCard, History, KanbanSquare, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Users,
    title: "Gestão de Leads e Contatos",
    description:
      "Cadastre leads com nome, e-mail, telefone, empresa e cargo, e encontre qualquer contato rapidamente com busca e filtros por status, responsável e data.",
  },
  {
    icon: KanbanSquare,
    title: "Pipeline Kanban de Vendas",
    description:
      "Visualize seus negócios em colunas — Novo Lead, Contato, Proposta, Negociação, Fechado — e arraste entre etapas com drag-and-drop.",
  },
  {
    icon: History,
    title: "Registro de Atividades",
    description:
      "Ligações, e-mails, reuniões e notas ficam organizados em uma timeline cronológica vinculada a cada lead, com autor e data de cada interação.",
  },
  {
    icon: BarChart3,
    title: "Dashboard de Métricas",
    description:
      "Acompanhe total de leads, negócios abertos, valor do pipeline e taxa de conversão em cards, além de um gráfico com negócios por etapa.",
  },
  {
    icon: Building2,
    title: "Multi-empresa e Colaboração",
    description:
      "Crie um workspace por empresa ou time, convide colaboradores por e-mail e alterne entre eles quando quiser. Seus dados ficam isolados com segurança.",
  },
  {
    icon: CreditCard,
    title: "Planos Flexíveis",
    description:
      "Comece grátis com até 2 colaboradores e 50 leads. Cresça para o plano Pro quando precisar de colaboradores e leads ilimitados.",
  },
];

export function LandingFeatures() {
  return (
    <section id="funcionalidades" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          Tudo que sua equipe de vendas precisa, em um só lugar
        </h2>
        <p className="mt-4 text-muted-foreground">
          Do primeiro contato ao fechamento, o PipeFlow acompanha cada etapa do seu processo
          comercial.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <Card
            key={feature.title}
            className="duration-500 animate-in fade-in-0 slide-in-from-bottom-2 [animation-fill-mode:backwards]"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <CardHeader>
              <div className="w-fit rounded-lg bg-primary/10 p-2 text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <CardTitle className="pt-2 text-base">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
