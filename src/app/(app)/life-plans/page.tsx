import { AppShell } from "@/components/layout/AppShell";
import { LifeEventCard, type LifeEventStatus } from "@/components/life-events/LifeEventCard";

type Plan = {
  title: string;
  status: LifeEventStatus;
  context: string;
  href: string;
};

const plans: Plan[] = [
  {
    title: "Job loss",
    status: "active",
    context: "Protect income, health coverage, and momentum while you reset.",
    href: "/life-plans/example",
  },
  {
    title: "Moving cities",
    status: "upcoming",
    context: "Line up housing, documents, and local services before you travel.",
    href: "/life-plans",
  },
  {
    title: "Medical recovery",
    status: "completed",
    context: "Capture follow-ups, paperwork, and steady routines after discharge.",
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
      <section className="grid gap-[var(--space-md)] md:grid-cols-2">
        {plans.map((plan) => (
          <LifeEventCard
            key={plan.title}
            title={plan.title}
            status={plan.status}
            context={plan.context}
            primaryAction={{ label: "View plan", href: plan.href }}
            secondaryAction={{ label: "Preview steps", href: plan.href }}
          />
        ))}
      </section>
    </AppShell>
  );
}
