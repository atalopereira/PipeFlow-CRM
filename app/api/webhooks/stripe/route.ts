import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";

type LocalStatus = "inactive" | "trialing" | "active" | "past_due" | "canceled";
type LocalPlan = "free" | "pro";

function mapSubscriptionState(stripeStatus: Stripe.Subscription.Status): {
  status: LocalStatus;
  plan: LocalPlan;
} {
  switch (stripeStatus) {
    case "trialing":
      return { status: "trialing", plan: "pro" };
    case "active":
      return { status: "active", plan: "pro" };
    case "past_due":
      return { status: "past_due", plan: "pro" };
    case "canceled":
      return { status: "canceled", plan: "free" };
    default:
      // incomplete, incomplete_expired, unpaid, paused: treat as no access yet.
      return { status: "inactive", plan: "free" };
  }
}

async function syncSubscription(subscription: Stripe.Subscription): Promise<void> {
  const workspaceId = subscription.metadata.workspace_id;
  const userId = subscription.metadata.user_id;

  if (!workspaceId) {
    console.error("Webhook da Stripe: assinatura sem workspace_id na metadata.", subscription.id);
    return;
  }

  const { status, plan } = mapSubscriptionState(subscription.status);
  // Stripe moved current_period_end from the subscription itself onto each
  // line item; we only ever create subscriptions with a single item.
  const currentPeriodEnd = subscription.items.data[0]?.current_period_end;
  const supabase = createAdminClient();

  await supabase.from("subscriptions").upsert(
    {
      workspace_id: workspaceId,
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      status,
      plan,
      current_period_end: currentPeriodEnd
        ? new Date(currentPeriodEnd * 1000).toISOString()
        : null,
    },
    { onConflict: "workspace_id" }
  );

  await supabase.from("workspaces").update({ plan }).eq("id", workspaceId);

  console.log(
    `Webhook da Stripe: workspace ${workspaceId} (usuário ${userId ?? "desconhecido"}) -> status=${status} plano=${plan}`
  );
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const subscription = invoice.parent?.subscription_details?.subscription;
  if (!subscription) return null;
  return typeof subscription === "string" ? subscription : subscription.id;
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Assinatura inválida no webhook da Stripe:", err);
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Checkout concluído: ativa o plano Pro.
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          await syncSubscription(subscription);
        }
        break;
      }
      // Assinatura cancelada/encerrada na Stripe: volta pro Free.
      case "customer.subscription.deleted": {
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;
      }
      // Cobrança falhou: sincroniza o status (past_due) sem derrubar o
      // acesso Pro imediatamente — a Stripe cuida das novas tentativas e só
      // dispara subscription.deleted se todas falharem.
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = getInvoiceSubscriptionId(invoice);
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          console.error(
            `Webhook da Stripe: falha de pagamento na fatura ${invoice.id} (assinatura ${subscriptionId}), tentativa ${invoice.attempt_count}.`
          );
          await syncSubscription(subscription);
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Erro ao processar webhook da Stripe:", err);
    return NextResponse.json({ error: "Erro ao processar evento." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
