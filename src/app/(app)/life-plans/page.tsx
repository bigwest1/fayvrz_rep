import { AppShell } from "@/components/layout/AppShell";
import { LifeEventCard, type LifeEventStatus } from "@/components/life-events/LifeEventCard";
import { getProfileSignals } from "@/lib/currentUser";
import { getRecommendedLifeEvents } from "@/lib/lifeEngine";
import { getAllLifeEventStates } from "@/lib/lifeState";
import { requireDbUser } from "@/lib/auth.server";

export default async function LifePlansPage() {
  const user = await requireDbUser();
  const signals = await getProfileSignals();
  const recommended = getRecommendedLifeEvents(signals);
  const lifeEventStates = await getAllLifeEventStates(user.id);

  return (
    <AppShell
      activePath="/life-plans"
      title="Life Plans"
      description="Life events organized as plans with tasks, context, and the right pacing."
    >
      <section className="card flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <p className="type-meta">Signals in use</p>
          <p className="type-body text-[color:var(--color-text-muted)]">
            {signals.location ? `Tuned for ${signals.location}. ` : ""}
            {signals.homeContext
              ? `Home context: ${signals.homeContext}. `
              : ""}
            {signals.incomeBand ? `Income feel: ${signals.incomeBand}.` : "Update signals anytime."}
          </p>
        </div>
        <Link
          href="/account"
          className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-4 py-2 text-sm font-semibold text-[color:var(--color-surface)] shadow-[var(--shadow-subtle)] transition-colors duration-[var(--motion-fast)] ease-[var(--motion-ease-standard)] hover:opacity-90"
        >
          Adjust signals
        </Link>
      </section>

      <section className="grid gap-[var(--space-md)] md:grid-cols-2">
        {recommended.map((plan) => {
          const state = lifeEventStates.find((item) => item.lifeEventId === plan.id);
          let status: LifeEventStatus = "upcoming";
          if (state?.status === "ACTIVE") status = "active";
          if (state?.status === "COMPLETED") status = "completed";

          return (
            <LifeEventCard
              key={plan.id}
              title={plan.title}
              status={status}
              context={plan.whoItsFor}
              primaryAction={{ label: "View plan", href: `/life-plans/${plan.id}` }}
              secondaryAction={{ label: "Preview steps", href: `/life-plans/${plan.id}` }}
            />
          );
        })}
        <LifeEventCard
          title="Example plan"
          status="upcoming"
          context="Preview the flow without saving anything. Good for sharing."
          primaryAction={{ label: "View example", href: "/life-plans/example" }}
          secondaryAction={{ label: "Preview steps", href: "/life-plans/example" }}
        />
      </section>
    </AppShell>
  );
}
