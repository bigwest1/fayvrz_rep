import Link from "next/link";
import { featureFlags } from "@/lib/features";

const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "always",
    summary: "Plan calmly, keep tasks and context aligned.",
    cta: { label: "Start free", href: "/sign-up" },
    points: [
      "Life events with steady pacing",
      "Task cards with context first",
      "Profile signals to tune guidance",
    ],
  },
  {
    name: "Plus",
    price: "$18",
    cadence: "per month",
    summary: "Autopilot drafts and deeper resource suggestions.",
    cta: { label: "Choose Plus", href: "/sign-up" },
    badge: featureFlags.AUTOPILOT_ENABLED ? "Autopilot live" : "Autopilot in rollout",
    points: [
      featureFlags.AUTOPILOT_ENABLED ? "Autopilot actions ready" : "Autopilot (coming soon)",
      featureFlags.LOCAL_RESOURCES_EXPANDED
        ? "Expanded local resource matching"
        : "Local resource matching roadmap",
      "Priority responses on new life events",
    ],
  },
  {
    name: "Pro",
    price: "$36",
    cadence: "per month",
    summary: "Families and caregivers with exports and shared context.",
    cta: { label: "Prepare for Pro", href: "/sign-up" },
    points: [
      "Multiple profiles and households",
      featureFlags.EXPORTS_ENABLED ? "Exports enabled" : "Exports planned",
      "Audit-ready history for caregivers",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="flex flex-1 justify-center bg-[color:var(--color-canvas)] px-6 py-14 sm:py-16">
      <div className="w-full max-w-6xl space-y-10">
        <header className="space-y-4 text-center">
          <p className="type-meta">Pricing</p>
          <h1 className="type-section">Straightforward plans</h1>
          <p className="type-body mx-auto max-w-3xl text-[color:var(--color-text-muted)]">
            No tricks, no funnels. Choose the level that fits how much you want Fayvrz to automate.
            You can move between plans without losing context.
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className="card flex h-full flex-col space-y-4 p-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-semibold text-[color:var(--color-text)]">{plan.name}</p>
                  {plan.badge ? (
                    <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text-muted)]">
                      {plan.badge}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-semibold text-[color:var(--color-text)]">
                    {plan.price}
                  </p>
                  <p className="text-sm text-[color:var(--color-text-muted)]">{plan.cadence}</p>
                </div>
                <p className="type-body text-[color:var(--color-text-muted)]">{plan.summary}</p>
              </div>

              <div className="space-y-2">
                {plan.points.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-sm text-[color:var(--color-text)]"
                  >
                    <span className="inline-flex h-2 w-2 rounded-full bg-[color:var(--color-border-strong)]" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href={plan.cta.href}
                  className="inline-flex w-full items-center justify-center rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-4 py-2 text-sm font-semibold text-[color:var(--color-surface)] shadow-[var(--shadow-subtle)] transition-colors duration-[var(--motion-base)] ease-[var(--motion-ease-subtle)] hover:opacity-90"
                >
                  {plan.cta.label}
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="card space-y-3 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="type-meta">Notes</p>
              <p className="type-body text-[color:var(--color-text-muted)]">
                Autopilot and exports stay off until we confirm safety and compliance. You will not
                be charged automatically; this page is to set expectations.
              </p>
            </div>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2 text-sm font-semibold text-[color:var(--color-text)] transition-colors duration-[var(--motion-base)] ease-[var(--motion-ease-subtle)] hover:border-[color:var(--color-border-strong)]"
            >
              Create account
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
