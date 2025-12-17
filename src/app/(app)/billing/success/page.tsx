import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function BillingSuccessPage() {
  return (
    <AppShell activePath="/billing" title="Subscription updated" description="Thanks for supporting Fayvrz.">
      <div className="card space-y-3 p-5">
        <p className="type-body text-[color:var(--color-text-muted)]">
          Your subscription was processed. If you need to change anything, use the manage link.
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
