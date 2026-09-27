"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { leadFormSchema, parseEstimatedValue, type LeadFormValues } from "@/lib/validations/lead";

export interface LeadActionResult {
  error?: string;
  leadId?: string;
}

export async function createLead(
  workspaceId: string,
  input: LeadFormValues
): Promise<LeadActionResult> {
  const parsed = leadFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Dados do lead inválidos." };
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
    .from("leads")
    .insert({
      workspace_id: workspaceId,
      owner_id: user.id,
      name: values.name,
      email: values.email,
      phone: values.phone,
      company: values.company,
      role: values.role || null,
      status_id: values.statusId,
      estimated_value: parseEstimatedValue(values.estimatedValue) ?? null,
      notes: values.notes || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Não foi possível criar o lead." };
  }

  revalidatePath("/leads");
  return { leadId: data.id };
}

export async function updateLead(
  workspaceId: string,
  leadId: string,
  input: LeadFormValues
): Promise<LeadActionResult> {
  const parsed = leadFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Dados do lead inválidos." };
  }

  const supabase = await createClient();
  const values = parsed.data;

  const { error } = await supabase
    .from("leads")
    .update({
      name: values.name,
      email: values.email,
      phone: values.phone,
      company: values.company,
      role: values.role || null,
      status_id: values.statusId,
      estimated_value: parseEstimatedValue(values.estimatedValue) ?? null,
      notes: values.notes || null,
    })
    .eq("id", leadId)
    .eq("workspace_id", workspaceId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);
  return { leadId };
}

export interface ActionResult {
  error?: string;
}

export async function deleteLead(workspaceId: string, leadId: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", leadId)
    .eq("workspace_id", workspaceId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/leads");
  return {};
}
