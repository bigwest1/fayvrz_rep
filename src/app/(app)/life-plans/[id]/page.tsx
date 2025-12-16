import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { TaskCard } from "@/components/life-events/TaskCard";
import { getProfileSignals, requireUser } from "@/lib/currentUser";
import { getPlanForLifeEvent } from "@/lib/lifeEngine";
import type { LifeEventTaskActionType } from "@/lib/lifeEventSchema";

type PlanPageProps = {
  params: { id: string };
};

const draftableActions: LifeEventTaskActionType[] = ["draft_email", "draft_script"];

export default async function LifePlanDetailPage({ params }: PlanPageProps) {
  await requireUser();
  const signals = await getProfileSignals();
  const plan = getPlanForLifeEvent(params.id, signals);

  if (!plan) {
    notFound();
  }

  return (
    <AppShell
      activePath="/life-plans"
      title={plan.title}
      description={plan.whoItsFor}
    >
      <section className="card space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <p className="type-meta">{plan.category} plan</p>
          {signals.location ? (
            <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text-muted)]">
              Tuned for {signals.location}
            </span>
          ) : null}
          {signals.homeContext ? (
            <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text-muted)]">
              Home: {signals.homeContext}
            </span>
          ) : null}
        </div>
        <p className="type-body text-[color:var(--color-text-muted)]">
          Calm sequence of steps with context first. Actions stay disabled until autopilot is ready;
          drafts will open as simple text for now.
        </p>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="type-meta">Tasks</p>
          <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text-muted)]">
            {plan.tasks.length} steps
          </span>
        </div>
        <div className="grid gap-3">
          {plan.tasks.map((task, index) => {
            const status = index < 2 ? "active" : "upcoming";
            const supportsDraft = draftableActions.includes(task.actionType);

            return (
              <TaskCard
                key={task.id}
                title={task.title}
                reason={task.why}
                status={status}
                defaultOpen={index < 1}
                actions={
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2 text-sm font-semibold text-[color:var(--color-text-muted)] opacity-70"
                    >
                      Autopilot (coming soon)
                    </button>
                    {supportsDraft ? (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-accent-calm)] px-4 py-2 text-sm font-semibold text-[color:var(--color-text)] transition-colors duration-[var(--motion-base)] ease-[var(--motion-ease-subtle)] hover:border-[color:var(--color-border-strong)]"
                      >
                        Draft
                      </button>
                    ) : null}
                    <span className="text-xs text-[color:var(--color-text-muted)]">
                      Nothing sends without review.
                    </span>
                  </div>
                }
              />
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
