"use server";

import { redirect } from "next/navigation";

import { stripe } from "@/lib/stripe/client";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  error?: string;
}

export async function createCheckoutSession(workspaceId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "Não autenticado." };
  }

  const { data: isAdmin } = await supabase.rpc("is_workspace_admin", { ws_id: workspaceId });
  if (!isAdmin) {
    return { error: "Apenas administradores podem gerenciar a assinatura." };
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("workspace_id", workspaceId)
    .maybeSingle();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
    customer: subscription?.stripe_customer_id ?? undefined,
    customer_email: subscription?.stripe_customer_id ? undefined : user.email,
    subscription_data: { metadata: { workspace_id: workspaceId, user_id: user.id } },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?checkout=canceled`,
  });

  if (!session.url) {
    return { error: "Não foi possível iniciar o checkout." };
  }

  redirect(session.url);
}

export async function createPortalSession(workspaceId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Não autenticado." };
  }

  const { data: isAdmin } = await supabase.rpc("is_workspace_admin", { ws_id: workspaceId });
  if (!isAdmin) {
    return { error: "Apenas administradores podem gerenciar a assinatura." };
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("workspace_id", workspaceId)
    .maybeSingle();

  if (!subscription?.stripe_customer_id) {
    return { error: "Nenhuma assinatura encontrada para este workspace." };
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  });

  redirect(session.url);
}
