import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function BillingCancelPage() {
  return (
    <AppShell activePath="/billing" title="Checkout canceled" description="No changes were made.">
      <div className="card space-y-3 p-5">
        <p className="type-body text-[color:var(--color-text-muted)]">
          You can keep using Fayvrz on your current plan. Upgrade anytime.
        </p>
        <Link
          href="/billing"
          className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-4 py-2 text-sm font-semibold text-[color:var(--color-surface)]"
        >
          Back to billing
        </Link>
      </div>
    </AppShell>
  );
}
