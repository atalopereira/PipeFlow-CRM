import { z } from "zod";

import { PIPELINE_STAGE_IDS } from "@/lib/constants/pipeline";

export const dealFormSchema = z.object({
  title: z.string().trim().min(2, "Informe o nome do negócio"),
  leadId: z.string().min(1, "Selecione um lead"),
  value: z
    .string()
    .trim()
    .min(1, "Informe o valor")
    .refine(
      (val) => !Number.isNaN(Number(val)) && Number(val) > 0,
      "Informe um valor numérico válido"
    ),
  stageId: z.enum(PIPELINE_STAGE_IDS),
  dueDate: z.string().min(1, "Informe o prazo"),
});

export type DealFormValues = z.infer<typeof dealFormSchema>;
