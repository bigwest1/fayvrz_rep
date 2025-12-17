import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured, StripeNotConfigured } from "@/lib/billing/stripe";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/currentUser";

export async function POST() {
  const user = await requireUser();

  if (!isStripeConfigured()) {
    return NextResponse.json({ ok: false, error: "BillingNotEnabled" }, { status: 503 });
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    if (err instanceof StripeNotConfigured) {
      return NextResponse.json({ ok: false, error: "BillingNotEnabled" }, { status: 503 });
    }
    throw err;
  }

  const sub = await prisma.subscription.findFirst({
    where: { userId: user.id, status: { in: ["ACTIVE", "TRIALING"] } },
    orderBy: { updatedAt: "desc" },
  });

  if (!sub?.stripeCustomerId) {
    return NextResponse.json({ ok: false, error: "NoCustomer" }, { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  });

  return NextResponse.json({ ok: true, url: session.url });
}
