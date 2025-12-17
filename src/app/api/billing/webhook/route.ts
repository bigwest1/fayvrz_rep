import { NextResponse } from "next/server";
import { getPlanByPriceId } from "@/lib/billing/plans";
import { getStripe, isStripeConfigured, StripeNotConfigured } from "@/lib/billing/stripe";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";

function normalizeStatus(status: string | null | undefined) {
  const upper = (status ?? "ACTIVE").toString().toUpperCase();
  if (["TRIALING", "ACTIVE", "PAST_DUE", "CANCELED"].includes(upper)) return upper;
  return "ACTIVE";
}

async function upsertSubscription(params: {
  clerkUserId?: string | null;
  planId: string;
  status: string;
  currentPeriodEnd?: number | null;
  cancelAtPeriodEnd?: boolean;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}) {
  const {
    clerkUserId,
    planId,
    status,
    currentPeriodEnd,
    cancelAtPeriodEnd,
    stripeCustomerId,
    stripeSubscriptionId,
  } = params;

  let userId: string | null = null;
  if (clerkUserId) {
    const dbUser = await prisma.user.findUnique({ where: { clerkUserId } });
    userId = dbUser?.id ?? null;
  }

  if (!userId) {
    await recordAudit("BILLING_SUBSCRIPTION_SKIPPED_NO_USER", { clerkUserId, stripeSubscriptionId });
    return null;
  }

  const data = {
    userId,
    provider: "STRIPE" as const,
    status,
    planId,
    currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
    cancelAtPeriodEnd: Boolean(cancelAtPeriodEnd),
    stripeCustomerId: stripeCustomerId ?? null,
    stripeSubscriptionId: stripeSubscriptionId ?? null,
  };

  if (stripeSubscriptionId) {
    return prisma.subscription.upsert({
      where: { stripeSubscriptionId },
      create: data,
      update: data,
    });
  }

  return prisma.subscription.upsert({
    where: {
      userId_provider_planId: {
        userId,
        provider: "STRIPE",
        planId,
      },
    },
    create: data,
    update: data,
  });
}

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ ok: true, skipped: true, reason: "BillingNotEnabled" });
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    if (err instanceof StripeNotConfigured) {
      return NextResponse.json({ ok: true, skipped: true, reason: "BillingNotEnabled" });
    }
    return NextResponse.json({ ok: false, error: "BillingInitFailed" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: `Invalid signature: ${err.message}` }, { status: 400 });
  }

  const data = event.data.object as any;

  if (event.type === "checkout.session.completed") {
    const session = data;
    const clerkUserId = session.client_reference_id ?? session.metadata?.clerkUserId ?? null;
    const planId =
      session.metadata?.planId ??
      getPlanByPriceId(session?.metadata?.priceId)?.id ??
      getPlanByPriceId(session?.subscription_details?.metadata?.priceId)?.id ??
      "FREE";

    if (!session.subscription) {
      await recordAudit("BILLING_SUBSCRIPTION_SKIPPED_NO_SUBSCRIPTION", { sessionId: session.id });
      return NextResponse.json({ ok: true });
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    const subPlan =
      planId ?? getPlanByPriceId(subscription.items?.data?.[0]?.price?.id)?.id ?? "FREE";
    const status = normalizeStatus(subscription.status);

    await upsertSubscription({
      clerkUserId,
      planId: subPlan,
      status,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
    });

    await recordAudit("BILLING_SUBSCRIPTION_CREATED", {
      subscriptionId: subscription.id,
      planId: subPlan,
      status,
    });
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = data;
    const planId = getPlanByPriceId(subscription.items?.data?.[0]?.price?.id)?.id ?? "FREE";
    const status = normalizeStatus(subscription.status);

    await upsertSubscription({
      clerkUserId: subscription.metadata?.clerkUserId ?? null,
      planId,
      status,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
    });

    await recordAudit("BILLING_SUBSCRIPTION_UPDATED", {
      subscriptionId: subscription.id,
      planId,
      status,
    });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = data;
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { status: "CANCELED" },
    });
    await recordAudit("BILLING_SUBSCRIPTION_CANCELED", {
      subscriptionId: subscription.id,
    });
  }

  return NextResponse.json({ ok: true });
}
