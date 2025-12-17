import Link from "next/link";
import type { PlanId } from "@/lib/billing/plans";

type Upsell = {
  key: string;
  suggestedPlanId: PlanId;
  message: string;
};

type Props = {
  title: string;
  detail?: string;
  upsell: Upsell;
};

export function UpsellPanel({ title, detail, upsell }: Props) {
  return (
    <div className="space-y-2 rounded-[var(--radius-lg)] border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-subtle)]">
      <p className="text-sm font-semibold text-[color:var(--color-text)]">{title}</p>
      {detail ? <p className="text-sm text-[color:var(--color-text-muted)]">{detail}</p> : null}
      <p className="text-sm text-[color:var(--color-text)]">{upsell.message}</p>
      <div className="flex flex-wrap gap-2 pt-1">
        <Link
          href="/billing"
          className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-4 py-2 text-xs font-semibold text-[color:var(--color-surface)] shadow-[var(--shadow-subtle)]"
        >
          Upgrade to {upsell.suggestedPlanId}
        </Link>
        <span className="inline-flex items-center rounded-full border border-[color:var(--color-border)] px-3 py-2 text-xs font-semibold text-[color:var(--color-text)]">
          Not now
        </span>
      </div>
    </div>
  );
}
