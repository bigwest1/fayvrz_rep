import { addMonths } from "date-fns";
import { JobType } from "@prisma/client";
import { prisma } from "../prisma";
import { getPlan, getPlanByPriceId, type PlanId } from "./plans";

export type UsageKey = "SCRIPT_EXPORTS_PER_MONTH" | "LOCAL_RESOURCE_REFRESHES_PER_MONTH" | "AUTOPILOT_ACTIONS_PER_MONTH";

const usageMap: Record<UsageKey, UsageKey> = {
  SCRIPT_EXPORTS_PER_MONTH: "SCRIPT_EXPORTS_PER_MONTH",
  LOCAL_RESOURCE_REFRESHES_PER_MONTH: "LOCAL_RESOURCE_REFRESHES_PER_MONTH",
  AUTOPILOT_ACTIONS_PER_MONTH: "AUTOPILOT_ACTIONS_PER_MONTH",
};

export type Entitlements = ReturnType<typeof getEntitlementLimits>;

export function getEntitlementLimits(planId: PlanId) {
  const plan = getPlan(planId);
  const e = plan.entitlements;
  return {
    MAX_ACTIVE_EVENTS: e.MAX_ACTIVE_EVENTS as number,
    LOCAL_RESOURCE_REFRESHES_PER_MONTH: e.LOCAL_RESOURCE_REFRESHES_PER_MONTH as number,
    SCRIPT_EXPORTS_PER_MONTH: e.SCRIPT_EXPORTS_PER_MONTH as number,
    AUTOPILOT_ACTIONS_PER_MONTH: e.AUTOPILOT_ACTIONS_PER_MONTH as number,
    PRIORITY_JOB_QUEUE: Boolean(e.PRIORITY_JOB_QUEUE),
    FAMILY_MEMBERS: e.FAMILY_MEMBERS as number,
    ADVANCED_TEMPLATES: Boolean(e.ADVANCED_TEMPLATES),
    ADMIN_ANALYTICS: Boolean(e.ADMIN_ANALYTICS),
  };
}

export async function getUserPlan(userId: string): Promise<PlanId> {
  const sub = await prisma.subscription.findFirst({
    where: { userId, status: { in: ["ACTIVE", "TRIALING"] } },
    orderBy: { updatedAt: "desc" },
  });
  return (sub?.planId as PlanId) ?? "FREE";
}

export async function getEntitlements(userId: string): Promise<Entitlements> {
  const planId = await getUserPlan(userId);
  return getEntitlementLimits(planId);
}

function currentUtcMonth() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = addMonths(start, 1);
  return { start, end };
}

export async function checkUsage(userId: string, key: UsageKey) {
  const entitlements = await getEntitlements(userId);
  const limit = entitlements[usageMap[key]] as number | boolean;

  if (typeof limit === "boolean") {
    return { allowed: limit, remaining: limit ? Number.POSITIVE_INFINITY : 0, used: 0, limit: limit ? -1 : 0 };
  }
  if (limit === 0) {
    return { allowed: false, remaining: 0, used: 0, limit };
  }

  const { start } = currentUtcMonth();
  const counter = await prisma.usageCounter.findFirst({
    where: { userId, key, periodStart: start },
  });
  const used = counter?.used ?? 0;
  const remaining = Math.max(limit - used, 0);
  return { allowed: remaining > 0, remaining, used, limit };
}

export async function incrementUsage(userId: string, key: UsageKey, amount = 1) {
  const { start, end } = currentUtcMonth();
  const planId = await getUserPlan(userId);
  const limit = getEntitlementLimits(planId)[usageMap[key]] as number | boolean;
  if (typeof limit === "boolean") return;

  await prisma.$transaction(async (tx) => {
    await tx.usageCounter.upsert({
      where: { userId_key_periodStart: { userId, key, periodStart: start } },
      create: { userId, key, periodStart: start, periodEnd: end, used: amount, limit },
      update: { used: { increment: amount } },
    });
  });
}

export function jobTypeToUsage(job: JobType | string): UsageKey | null {
  if (job === JobType.GENERATE_RESOURCES_FOR_TASK) return "LOCAL_RESOURCE_REFRESHES_PER_MONTH";
  return null;
}

export { getPlanByPriceId };
