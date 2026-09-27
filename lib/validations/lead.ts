import { z } from "zod";

import { LEAD_STATUS_IDS } from "@/lib/constants/lead-status";

export const leadFormSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do lead"),
  email: z.string().trim().min(1, "Informe o e-mail").email("E-mail inválido"),
  phone: z.string().trim().min(8, "Informe um telefone válido"),
  company: z.string().trim().min(1, "Informe a empresa"),
  role: z.string().trim(),
  statusId: z.enum(LEAD_STATUS_IDS),
  estimatedValue: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || !Number.isNaN(Number(val)), "Informe um valor numérico válido"),
  notes: z.string().trim().optional(),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

export function parseEstimatedValue(value: string | undefined): number | undefined {
  return value ? Number(value) : undefined;
}
