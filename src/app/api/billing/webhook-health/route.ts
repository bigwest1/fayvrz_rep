import { NextResponse } from "next/server";
import { isStripeConfigured } from "@/lib/billing/stripe";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, stripeConfigured: isStripeConfigured() });
}
