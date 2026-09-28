import { z } from "zod";

import { ACTIVITY_TYPE_IDS } from "@/lib/constants/activity-type";

export const activityFormSchema = z.object({
  type: z.enum(ACTIVITY_TYPE_IDS),
  title: z.string().trim().min(2, "Informe um título"),
  description: z.string().trim().min(1, "Informe uma descrição"),
  date: z.string().min(1, "Informe a data"),
});

export type ActivityFormValues = z.infer<typeof activityFormSchema>;
