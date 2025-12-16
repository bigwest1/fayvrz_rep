import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

const placeholderPlans = [
  {
    title: "Job loss",
    status: "Active",
    summary: "Stay steady while handling benefits, coverage, and outreach.",
    href: "/life-plans/example",
  },
  {
    title: "Moving cities",
    status: "Upcoming",
    summary: "Plan logistics, housing, and local services without rushing.",
    href: "/life-plans",
  },
];

export default function LifePlansPage() {
  return (
    <AppShell
      activePath="/life-plans"
      title="Life Plans"
      description="Life events organized as plans with tasks, context, and the right pacing."
    >
      <section className="grid gap-4 md:grid-cols-2">
        {placeholderPlans.map((plan) => (
          <article
            key={plan.title}
            className="card space-y-3 p-5 transition-colors hover:border-[color:var(--color-border-strong)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[color:var(--color-text)]">
                  {plan.title}
                </h2>
                <p className="type-body">{plan.summary}</p>
              </div>
              <span className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text-muted)]">
                {plan.status}
              </span>
            </div>
            <Link
              href={plan.href}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-surface-muted)]"
            >
              View plan
            </Link>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
