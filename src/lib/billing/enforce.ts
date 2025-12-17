import { getEntitlements, getUserPlan, checkUsage, incrementUsage, type UsageKey } from "./entitlements";
import type { PlanId } from "./plans";

type Upsell = {
  key: string;
  suggestedPlanId: PlanId;
  message: string;
};

export async function enforceUsageOrUpsell(userId: string, key: UsageKey) {
  const usage = await checkUsage(userId, key);
  if (usage.allowed) return { ok: true as const, usage };

  const planId = await getUserPlan(userId);
  const suggestedPlanId = planId === "FREE" ? "PLUS" : planId === "PLUS" ? "PRO" : "PRO";
  const upsell: Upsell = {
    key,
    suggestedPlanId,
    message: "You’ve reached this limit. Upgrade to keep going.",
  };
  return { ok: false as const, upsell, usage };
}

export async function enforceEntitlementOrUpsell(userId: string, key: keyof Awaited<ReturnType<typeof getEntitlements>>) {
  const ent = await getEntitlements(userId);
  const value = ent[key];
  if (typeof value === "boolean") {
    if (value) return { ok: true as const, entitlements: ent };
    const planId = await getUserPlan(userId);
    const suggestedPlanId: PlanId = planId === "FREE" ? "PLUS" : planId === "PLUS" ? "PRO" : planId;
    const upsell: Upsell = {
      key,
      suggestedPlanId,
      message: "This feature needs a higher plan.",
    };
    return { ok: false as const, upsell, entitlements: ent };
  }
  return { ok: true as const, entitlements: ent };
}

export async function consumeUsage(userId: string, key: UsageKey, amount = 1) {
  await incrementUsage(userId, key, amount);
}
