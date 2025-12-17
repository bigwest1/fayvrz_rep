import { NextResponse } from "next/server";
import { isStripeConfigured } from "@/lib/billing/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const version = process.env.npm_package_version ?? "dev";
  let dbConfigured = false;
  try {
    await Promise.race([
      prisma.user.count({ take: 1 }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 1500)),
    ]);
    dbConfigured = true;
  } catch {
    dbConfigured = false;
  }
  return NextResponse.json({
    ok: true,
    version,
    stripeConfigured: isStripeConfigured(),
    dbConfigured,
  });
}
