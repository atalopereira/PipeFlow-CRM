import type { Activity } from "@/types/activity";

// Same fixed-reference rationale as lib/mock/leads.ts — keeps SSR and
// client hydration output identical.
const NOW = new Date("2026-09-12T12:00:00.000Z");

function hoursAgo(hours: number): string {
  const date = new Date(NOW);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "activity_001",
    leadId: "lead_001",
    type: "ligacao",
    title: "Ligação de prospecção",
    author: "Atalo Araujo",
    description: "Apresentei o produto e marquei demonstração para terça.",
    date: hoursAgo(72),
  },
  {
    id: "activity_002",
    leadId: "lead_001",
    type: "reuniao",
    title: "Demonstração do produto",
    author: "Atalo Araujo",
    description: "Demo realizada por videoconferência. Boa receptividade. Pediu proposta formal.",
    date: hoursAgo(48),
  },
  {
    id: "activity_003",
    leadId: "lead_001",
    type: "email",
    title: "Proposta comercial enviada",
    author: "Atalo Araujo",
    description: "Enviada proposta com plano Enterprise por R$ 85.000/ano.",
    date: hoursAgo(24),
  },
  {
    id: "activity_004",
    leadId: "lead_001",
    type: "nota",
    title: "Follow-up pendente",
    author: "Atalo Araujo",
    description: "Aguardando retorno sobre aprovação interna. Ligar na sexta.",
    date: hoursAgo(5),
  },
  {
    id: "activity_005",
    leadId: "lead_002",
    type: "email",
    title: "Primeiro contato",
    author: "Camila Souza",
    description: "Enviei material institucional da PipeFlow.",
    date: hoursAgo(96),
  },
  {
    id: "activity_006",
    leadId: "lead_002",
    type: "ligacao",
    title: "Ligação de qualificação",
    author: "Camila Souza",
    description: "Empresa já usa um concorrente, mas está insatisfeita com o suporte.",
    date: hoursAgo(50),
  },
  {
    id: "activity_007",
    leadId: "lead_002",
    type: "nota",
    title: "Agendar demonstração",
    author: "Camila Souza",
    description: "Agendar demonstração do produto para a próxima semana.",
    date: hoursAgo(10),
  },
  {
    id: "activity_008",
    leadId: "lead_004",
    type: "reuniao",
    title: "Apresentação inicial",
    author: "Atalo Araujo",
    description: "Apresentação do produto para a sócia-proprietária.",
    date: hoursAgo(200),
  },
  {
    id: "activity_009",
    leadId: "lead_004",
    type: "ligacao",
    title: "Follow-up da proposta",
    author: "Atalo Araujo",
    description: "Aguardando aprovação financeira da proposta enviada.",
    date: hoursAgo(80),
  },
];
