"use server";

import { revalidatePath } from "next/cache";

import { PIPELINE_STAGE_IDS, type PipelineStageId } from "@/lib/constants/pipeline";
import { createClient } from "@/lib/supabase/server";
import { dealFormSchema, type DealFormValues } from "@/lib/validations/deal";

export interface DealActionResult {
  error?: string;
  dealId?: string;
}

export async function createDeal(
  workspaceId: string,
  input: DealFormValues
): Promise<DealActionResult> {
  const parsed = dealFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Dados do negócio inválidos." };
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
    .from("deals")
    .insert({
      workspace_id: workspaceId,
      lead_id: values.leadId,
      owner_id: user.id,
      title: values.title,
      value: Number(values.value),
      stage_id: values.stageId,
      due_date: values.dueDate,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Não foi possível criar o negócio." };
  }

  revalidatePath("/pipeline");
  return { dealId: data.id };
}

export interface ActionResult {
  error?: string;
}

export async function updateDealStage(
  workspaceId: string,
  dealId: string,
  stageId: PipelineStageId
): Promise<ActionResult> {
  if (!PIPELINE_STAGE_IDS.includes(stageId)) {
    return { error: "Etapa inválida." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("deals")
    .update({ stage_id: stageId })
    .eq("id", dealId)
    .eq("workspace_id", workspaceId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/pipeline");
  return {};
}
