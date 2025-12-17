import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured, StripeNotConfigured } from "@/lib/billing/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

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

  const dbUser = await prisma.user.findUnique({ where: { clerkUserId } });
  if (!dbUser) {
    return NextResponse.json({ ok: false, error: "UserNotFound" }, { status: 404 });
  }

  const sub = await prisma.subscription.findFirst({
    where: { userId: dbUser.id, status: { in: ["ACTIVE", "TRIALING"] } },
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
