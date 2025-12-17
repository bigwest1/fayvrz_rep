import { PLANS } from "@/lib/billing/plans";
import { requireUser } from "@/lib/currentUser";
import { getEntitlements, getUserPlan } from "@/lib/billing/entitlements";
import { isStripeConfigured } from "@/lib/billing/stripe";
import { prisma } from "@/lib/prisma";
import { BillingCard } from "@/components/billing/BillingCard";
import { UsageMeter } from "@/components/billing/UsageMeter";
import { UpsellPanel } from "@/components/billing/UpsellPanel";

export default async function BillingPage() {
  const user = await requireUser();
  const currentPlan = await getUserPlan(user.id);
  const stripeOn = isStripeConfigured();
  const entitlements = await getEntitlements(user.id);
  const usageCounters = await prisma.usageCounter.findMany({
    where: { userId: user.id },
    orderBy: { periodStart: "desc" },
  });
  const usageFor = (key: string) => usageCounters.find((c) => c.key === key);
  const renewal = await prisma.subscription.findFirst({
    where: { userId: user.id, status: { in: ["ACTIVE", "TRIALING"] } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <section className="card space-y-3 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="type-meta">Billing</p>
            <p className="type-body text-[color:var(--color-text-muted)]">
              Current plan: {currentPlan}. {renewal?.currentPeriodEnd ? `Renews ${new Date(renewal.currentPeriodEnd).toLocaleDateString()}` : ""}
            </p>
          </div>
          {stripeOn && renewal?.stripeCustomerId ? (
            <form action="/api/billing/portal" method="post">
              <button className="rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-4 py-2 text-sm font-semibold text-[color:var(--color-surface)]">
                Manage billing
              </button>
            </form>
          ) : (
            <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-sm text-[color:var(--color-text-muted)]">
              Billing isn’t enabled yet. You can keep using Fayvrz for free.
            </div>
          )}
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          <UsageMeter
            label="Autopilot actions"
            used={usageFor("AUTOPILOT_ACTIONS_PER_MONTH")?.used ?? 0}
            limit={entitlements.AUTOPILOT_ACTIONS_PER_MONTH || entitlements.AUTOPILOT_ACTIONS_PER_MONTH === 0 ? entitlements.AUTOPILOT_ACTIONS_PER_MONTH : "unlimited"}
          />
          <UsageMeter
            label="Resource refreshes"
            used={usageFor("LOCAL_RESOURCE_REFRESHES_PER_MONTH")?.used ?? 0}
            limit={entitlements.LOCAL_RESOURCE_REFRESHES_PER_MONTH || entitlements.LOCAL_RESOURCE_REFRESHES_PER_MONTH === 0 ? entitlements.LOCAL_RESOURCE_REFRESHES_PER_MONTH : "unlimited"}
          />
          <UsageMeter
            label="Script exports"
            used={usageFor("SCRIPT_EXPORTS_PER_MONTH")?.used ?? 0}
            limit={entitlements.SCRIPT_EXPORTS_PER_MONTH || entitlements.SCRIPT_EXPORTS_PER_MONTH === 0 ? entitlements.SCRIPT_EXPORTS_PER_MONTH : "unlimited"}
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {Object.values(PLANS).map((plan) => {
          return (
            <BillingCard
              key={plan.id}
              plan={plan}
              currentPlanId={currentPlan}
              stripeEnabled={stripeOn}
              onSelectHref="/api/billing/checkout"
            >
              {currentPlan === plan.id ? (
                <UpsellPanel
                  title="You’re on this plan"
                  detail="You can manage billing below."
                  upsell={{ key: "plan", suggestedPlanId: plan.id, message: "Stay steady—downgrades keep data." }}
                />
              ) : null}
            </BillingCard>
          );
        })}
      </section>
    </div>
  );
}
