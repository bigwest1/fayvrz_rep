import type { Plan } from "@/lib/billing/plans";

type BillingCardProps = {
  plan: Plan;
  currentPlanId: string;
  onSelectHref?: string;
  stripeEnabled: boolean;
  children?: React.ReactNode;
};

export function BillingCard({ plan, currentPlanId, onSelectHref = "/api/billing/checkout", stripeEnabled, children }: BillingCardProps) {
  const isCurrent = plan.id === currentPlanId;
  const label = isCurrent ? "Current" : plan.monthlyPriceUsd === 0 ? "Start" : plan.monthlyPriceUsd > 0 && plan.id < currentPlanId ? "Downgrade" : "Upgrade";
  const disabled = !stripeEnabled && plan.monthlyPriceUsd > 0;

  return (
    <article className="card space-y-3 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-[color:var(--color-text)]">{plan.name}</p>
          <p className="text-sm text-[color:var(--color-text-muted)]">
            {plan.monthlyPriceUsd === 0 ? "Free forever" : `$${plan.monthlyPriceUsd}/mo`}
          </p>
        </div>
        <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text-muted)]">
          {isCurrent ? "Current" : plan.id}
        </span>
      </div>
      <ul className="space-y-1 text-sm text-[color:var(--color-text-muted)]">
        {Object.entries(plan.entitlements)
          .slice(0, 5)
          .map(([key, val]) => (
            <li key={key} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[color:var(--color-border-strong)]" />
              {key}: {typeof val === "boolean" ? (val ? "Yes" : "No") : val}
            </li>
          ))}
      </ul>
      {children}
      <form action={onSelectHref} method="post" className="pt-1">
        <input type="hidden" name="planId" value={plan.id} />
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex w-full items-center justify-center rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-4 py-2 text-sm font-semibold text-[color:var(--color-surface)] shadow-[var(--shadow-subtle)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:border-[color:var(--color-border)] disabled:bg-[color:var(--color-surface-muted)] disabled:text-[color:var(--color-text-muted)]"
        >
          {disabled ? "Billing disabled" : label}
        </button>
      </form>
      {!stripeEnabled && plan.monthlyPriceUsd > 0 ? (
        <p className="text-xs text-[color:var(--color-text-muted)]">
          Billing isn’t enabled yet. You can keep using Fayvrz for free.
        </p>
      ) : null}
    </article>
  );
}
