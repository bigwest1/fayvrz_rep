import { NextResponse } from "next/server";
import { getPlan, type PlanId } from "@/lib/billing/plans";
import { getStripe, isStripeConfigured, StripeNotConfigured } from "@/lib/billing/stripe";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/currentUser";

export async function POST(req: Request) {
  const user = await requireUser();
  const clerkUserId = user.clerkUserId;

  let planId: string | undefined;
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    planId = body?.planId;
  } else {
    const form = await req.formData();
    planId = form.get("planId")?.toString();
  }
  const plan = getPlan(planId as PlanId);

  if (!isStripeConfigured()) {
    return NextResponse.json({ ok: false, error: "BillingNotEnabled" }, { status: 503 });
  }

  if (!plan.stripePriceId || plan.id === "FREE") {
    return NextResponse.json({ ok: true });
  }

  const dbUser = user;

  let stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    if (err instanceof StripeNotConfigured) {
      return NextResponse.json({ ok: false, error: "BillingNotEnabled" }, { status: 503 });
    }
    throw err;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    client_reference_id: clerkUserId,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`,
    metadata: {
      planId: plan.id,
      clerkUserId,
      dbUserId: dbUser.id,
    },
  });

  return NextResponse.json({ ok: true, url: session.url });
}
