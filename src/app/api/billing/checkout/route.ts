import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getPlan, type PlanId } from "@/lib/billing/plans";
import { getStripe, isStripeConfigured, StripeNotConfigured } from "@/lib/billing/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

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

  let dbUser = await prisma.user.findUnique({ where: { clerkUserId } });
  if (!dbUser) {
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    dbUser = await prisma.user.create({
      data: {
        clerkUserId,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
        displayName:
          clerkUser.fullName ||
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
          clerkUser.username ||
          clerkUser.primaryEmailAddress?.emailAddress ||
          "Member",
        imageUrl: clerkUser.imageUrl ?? null,
      },
    });
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
