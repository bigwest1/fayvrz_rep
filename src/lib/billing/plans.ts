import { UserRole } from "@prisma/client";

export type EntitlementKey =
  | "MAX_ACTIVE_EVENTS"
  | "AUTOPILOT_ACTIONS_PER_MONTH"
  | "LOCAL_RESOURCE_REFRESHES_PER_MONTH"
  | "SCRIPT_EXPORTS_PER_MONTH"
  | "PRIORITY_JOB_QUEUE"
  | "FAMILY_MEMBERS"
  | "ADVANCED_TEMPLATES"
  | "ADMIN_ANALYTICS";

export type PlanId = "FREE" | "PLUS" | "FAMILY" | "PRO";

export type Plan = {
  id: PlanId;
  name: string;
  stripePriceId: string | null;
  monthlyPriceUsd: number;
  entitlements: Record<EntitlementKey, number | boolean>;
};

const planList: Plan[] = [
  {
    id: "FREE",
    name: "Free",
    stripePriceId: null,
    monthlyPriceUsd: 0,
    entitlements: {
      MAX_ACTIVE_EVENTS: 2,
      AUTOPILOT_ACTIONS_PER_MONTH: 0,
      LOCAL_RESOURCE_REFRESHES_PER_MONTH: 8,
      SCRIPT_EXPORTS_PER_MONTH: 10,
      PRIORITY_JOB_QUEUE: false,
      FAMILY_MEMBERS: 0,
      ADVANCED_TEMPLATES: false,
      ADMIN_ANALYTICS: false,
    },
  },
  {
    id: "PLUS",
    name: "Plus",
    stripePriceId: process.env.STRIPE_PRICE_PLUS_ID ?? null,
    monthlyPriceUsd: 18,
    entitlements: {
      MAX_ACTIVE_EVENTS: 6,
      AUTOPILOT_ACTIONS_PER_MONTH: 30,
      LOCAL_RESOURCE_REFRESHES_PER_MONTH: 30,
      SCRIPT_EXPORTS_PER_MONTH: 60,
      PRIORITY_JOB_QUEUE: false,
      FAMILY_MEMBERS: 0,
      ADVANCED_TEMPLATES: true,
      ADMIN_ANALYTICS: false,
    },
  },
  {
    id: "FAMILY",
    name: "Family",
    stripePriceId: process.env.STRIPE_PRICE_FAMILY_ID ?? null,
    monthlyPriceUsd: 36,
    entitlements: {
      MAX_ACTIVE_EVENTS: 10,
      AUTOPILOT_ACTIONS_PER_MONTH: 60,
      LOCAL_RESOURCE_REFRESHES_PER_MONTH: 60,
      SCRIPT_EXPORTS_PER_MONTH: 120,
      PRIORITY_JOB_QUEUE: true,
      FAMILY_MEMBERS: 4,
      ADVANCED_TEMPLATES: true,
      ADMIN_ANALYTICS: false,
    },
  },
  {
    id: "PRO",
    name: "Pro",
    stripePriceId: process.env.STRIPE_PRICE_PRO_ID ?? null,
    monthlyPriceUsd: 56,
    entitlements: {
      MAX_ACTIVE_EVENTS: 20,
      AUTOPILOT_ACTIONS_PER_MONTH: 120,
      LOCAL_RESOURCE_REFRESHES_PER_MONTH: 120,
      SCRIPT_EXPORTS_PER_MONTH: 240,
      PRIORITY_JOB_QUEUE: true,
      FAMILY_MEMBERS: 6,
      ADVANCED_TEMPLATES: true,
      ADMIN_ANALYTICS: true,
    },
  },
];

export const PLANS: Record<PlanId, Plan> = planList.reduce(
  (acc, plan) => ({ ...acc, [plan.id]: plan }),
  {} as Record<PlanId, Plan>,
);

export function getPlan(planId: PlanId | null | undefined): Plan {
  if (!planId) return PLANS.FREE;
  return PLANS[planId] ?? PLANS.FREE;
}

export function getPlanByPriceId(priceId: string | null | undefined): Plan | null {
  if (!priceId) return null;
  return planList.find((p) => p.stripePriceId === priceId) ?? null;
}

export function roleAllowsAdmin(role: UserRole) {
  return role === "ADMIN" || role === "OWNER";
}
