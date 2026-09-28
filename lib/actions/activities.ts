"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { activityFormSchema, type ActivityFormValues } from "@/lib/validations/activity";

export interface ActivityActionResult {
  error?: string;
  activityId?: string;
}

export async function createActivity(
  workspaceId: string,
  leadId: string,
  input: ActivityFormValues
): Promise<ActivityActionResult> {
  const parsed = activityFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Dados da atividade inválidos." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Não autenticado." };
  }

  const values = parsed.data;
  const { data, error } = await supabase
    .from("activities")
    .insert({
      workspace_id: workspaceId,
      lead_id: leadId,
      author_id: user.id,
      type: values.type,
      title: values.title,
      description: values.description,
      occurred_at: values.date,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Não foi possível registrar a atividade." };
  }

  revalidatePath(`/leads/${leadId}`);
  return { activityId: data.id };
}
