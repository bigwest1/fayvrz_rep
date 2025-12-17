import { NextResponse } from "next/server";
import { SubscriptionStatus } from "@prisma/client";
import type Stripe from "stripe";
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
  status: SubscriptionStatus;
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
    status: status as SubscriptionStatus,
    planId,
    currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
    cancelAtPeriodEnd: Boolean(cancelAtPeriodEnd),
    stripeCustomerId: stripeCustomerId ?? null,
    stripeSubscriptionId: stripeSubscriptionId ?? null,
  };

  if (stripeSubscriptionId) {
    const existing = await prisma.subscription.findFirst({ where: { stripeSubscriptionId } });
    if (existing) {
      return prisma.subscription.update({ where: { id: existing.id }, data });
    }
    return prisma.subscription.create({ data });
  }

  const existingUserSub = await prisma.subscription.findFirst({
    where: { userId, provider: "STRIPE" },
    orderBy: { updatedAt: "desc" },
  });
  if (existingUserSub) {
    return prisma.subscription.update({ where: { id: existingUserSub.id }, data });
  }
  return prisma.subscription.create({ data });
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

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ ok: false, error: `Invalid signature: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const clerkUserId = session.client_reference_id ?? session.metadata?.clerkUserId ?? null;
    const planId =
      session.metadata?.planId ??
      getPlanByPriceId(session?.metadata?.priceId)?.id ??
      "FREE";

    if (!session.subscription) {
      await recordAudit("BILLING_SUBSCRIPTION_SKIPPED_NO_SUBSCRIPTION", { sessionId: session.id });
      return NextResponse.json({ ok: true });
    }

    const subscription = (await stripe.subscriptions.retrieve(
      session.subscription as string,
    )) as Stripe.Subscription;
    const sub = subscription as Stripe.Subscription;
    const subPlan =
      planId ?? getPlanByPriceId(sub.items?.data?.[0]?.price?.id)?.id ?? "FREE";
    const status = normalizeStatus(sub.status) as SubscriptionStatus;

    await upsertSubscription({
      clerkUserId,
      planId: subPlan,
      status,
      currentPeriodEnd: (sub as unknown as Record<string, unknown>)["current_period_end"] as number | null,
      cancelAtPeriodEnd: (sub as unknown as Record<string, unknown>)["cancel_at_period_end"] as boolean | undefined,
      stripeCustomerId: sub.customer as string,
      stripeSubscriptionId: sub.id,
    });

    await recordAudit("BILLING_SUBSCRIPTION_CREATED", {
      subscriptionId: subscription.id,
      planId: subPlan,
      status,
    });
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const sub = subscription as Stripe.Subscription;
    const planId = getPlanByPriceId(sub.items?.data?.[0]?.price?.id)?.id ?? "FREE";
    const status = normalizeStatus(sub.status) as SubscriptionStatus;

    await upsertSubscription({
      clerkUserId: sub.metadata?.clerkUserId ?? null,
      planId,
      status,
      currentPeriodEnd: (sub as unknown as Record<string, unknown>)["current_period_end"] as number | null,
      cancelAtPeriodEnd: (sub as unknown as Record<string, unknown>)["cancel_at_period_end"] as boolean | undefined,
      stripeCustomerId: sub.customer as string,
      stripeSubscriptionId: sub.id,
    });

    await recordAudit("BILLING_SUBSCRIPTION_UPDATED", {
      subscriptionId: subscription.id,
      planId,
      status,
    });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
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
