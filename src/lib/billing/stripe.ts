import Stripe from "stripe";

export class StripeNotConfigured extends Error {
  constructor() {
    super("StripeNotConfigured");
  }
}

export function isStripeConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_WEBHOOK_SECRET &&
      process.env.NEXT_PUBLIC_APP_URL,
  );
}

export function getStripe() {
  if (!isStripeConfigured()) {
    throw new StripeNotConfigured();
  }
  const key = process.env.STRIPE_SECRET_KEY!;
  return new Stripe(key, {
    apiVersion: "2024-06-20",
    appInfo: { name: "Fayvrz", version: "0.1.0" },
  });
}
