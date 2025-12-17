import Link from "next/link";
import { JobType, UserTaskStatus } from "@prisma/client";
import { AppShell } from "@/components/layout/AppShell";
import { requireUser, getProfileSignals } from "@/lib/currentUser";
import { ensureUserEvent, getUserEventsWithTasks, getUserTasksByStatus, updateUserTaskStatus } from "@/lib/events";
import { enqueueJob } from "@/lib/jobs/queue";
import { prisma } from "@/lib/prisma";
import { enforceUsageOrUpsell, consumeUsage } from "@/lib/billing/enforce";
import { FocusCard, IntentBar, Reveal } from "@/components/ux";

export default async function HomePage() {
  const user = await requireUser();
  const signals = await getProfileSignals();

  async function logLifeContext(formData: FormData) {
    "use server";
    const message = (formData.get("context") ?? "").toString().slice(0, 240);
    if (!message) return;
    await prisma.auditLog.create({
      data: {
        actorUserId: user.id,
        action: "LIFE_CONTEXT_NOTE",
        targetType: "Note",
        metadataJson: { message },
      },
    });
  }

  async function startEvent(slug: string) {
    "use server";
    await ensureUserEvent(slug, user.id);
  }

  async function generateResources() {
    "use server";
    const profile = await getProfileSignals();
    const events = await prisma.lifeEvent.findMany({ include: { tasks: true } });
    for (const event of events) {
      await ensureUserEvent(event.slug, user.id);
      for (const task of event.tasks) {
        const allowed = await enforceUsageOrUpsell(user.id, "LOCAL_RESOURCE_REFRESHES_PER_MONTH");
        if (!allowed.ok) {
          return;
        }
        await enqueueJob(
          user.id,
          JobType.GENERATE_RESOURCES_FOR_TASK,
          {
            taskTemplateId: task.id,
            queryKey: `${task.id}:${profile.location ?? "generic"}`,
            query: `${task.title} ${profile.location ?? ""}`.trim(),
            context: {
              location: {
                city: profile.location?.split(",")?.[0]?.trim(),
                state: profile.location?.split(",")?.[1]?.trim(),
              },
              category: event.slug,
              taskTitle: task.title,
            },
          },
          new Date(),
        );
        await consumeUsage(user.id, "LOCAL_RESOURCE_REFRESHES_PER_MONTH");
      }
    }
  }

  const userEvents = await getUserEventsWithTasks(user.id);
  const todos = await getUserTasksByStatus(user.id, UserTaskStatus.TODO);

  const allEvents = await prisma.lifeEvent.findMany();
  const missingEvents = allEvents.filter((evt) => !userEvents.find((ue) => ue.lifeEventId === evt.id));
  const exampleCards = [
    { title: "New baby arriving", summary: "Leave paperwork, pediatrician choices, calm checklists." },
    { title: "Parent needs care", summary: "Benefits, local services, scripts to request help." },
    { title: "Washing machine broke", summary: "Warranty check, local repair, stop-gap options." },
  ];

  return (
    <AppShell
      activePath="/home"
      title="Home"
      description="A calm starting point for your current life events and resources."
    >
      <section className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <IntentBar />
        <form action={logLifeContext} className="card space-y-3 p-5">
          <p className="type-meta">What&apos;s going on?</p>
          <p className="type-body text-[color:var(--color-text-muted)]">
            Capture a quick note to shape suggestions. We keep it private.
          </p>
          <textarea
            name="context"
            placeholder="Example: New baby arriving in June, need leave paperwork and pediatrician nearby."
            className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-border-strong)] focus:outline-none"
            rows={3}
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-4 py-2 text-sm font-semibold text-[color:var(--color-surface)] shadow-[var(--shadow-subtle)]"
          >
            Save note
          </button>
        </form>

        <form action={generateResources} className="card space-y-3 p-5">
          <div className="flex items-center justify-between">
            <p className="type-meta">Resources</p>
            <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-2 py-1 text-xs font-semibold text-[color:var(--color-text-muted)]">
              Uses your signals
            </span>
          </div>
          <p className="type-body text-[color:var(--color-text-muted)]">
            We can fetch suggested resources for your tasks. Results stay tagged as “verify details.”
          </p>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-4 py-2 text-sm font-semibold text-[color:var(--color-surface)] shadow-[var(--shadow-subtle)] hover:opacity-90"
          >
            Generate resources
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <p className="type-meta">Examples (no account needed)</p>
        <div className="grid gap-3 md:grid-cols-3">
          {exampleCards.map((card, idx) => (
            <Reveal key={card.title} delay={idx * 0.05}>
              <FocusCard status="preview">
                <p className="font-semibold text-[color:var(--color-text)]">{card.title}</p>
                <p className="text-sm text-[color:var(--color-text-muted)]">{card.summary}</p>
                <a
                  href="/start"
                  className="mt-3 inline-flex rounded-full border border-[color:var(--color-text)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)]"
                >
                  Save this plan (sign in)
                </a>
              </FocusCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="type-meta">Active events</p>
          <div className="flex gap-2">
            {missingEvents.map((evt) => (
              <form key={evt.id} action={() => startEvent(evt.slug)}>
                <button className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)] hover:border-[color:var(--color-border-strong)]">
                  Add {evt.title}
                </button>
              </form>
            ))}
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {userEvents.map((evt) => (
            <article key={evt.id} className="card space-y-2 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="type-meta">{evt.lifeEvent.slug}</p>
                  <p className="text-lg font-semibold text-[color:var(--color-text)]">
                    {evt.lifeEvent.title}
                  </p>
                </div>
                <Link
                  href={`/events/${evt.lifeEvent.slug}`}
                  className="rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-3 py-1 text-xs font-semibold text-[color:var(--color-surface)] hover:opacity-90"
                >
                  View
                </Link>
              </div>
              <p className="type-body text-[color:var(--color-text-muted)]">
                {evt.userTasks.filter((t) => t.status !== UserTaskStatus.DONE).length} open steps
              </p>
            </article>
          ))}
          {userEvents.length === 0 ? (
            <article className="card p-5">
              <p className="type-body text-[color:var(--color-text-muted)]">
                No active events yet. Start one to see tasks and resources.
              </p>
            </article>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="type-meta">Suggested next actions</p>
          <span className="text-sm text-[color:var(--color-text-muted)]">
            Based on your tasks
          </span>
        </div>
        <div className="grid gap-2">
          {todos.slice(0, 6).map((task) => (
            <article
              key={task.id}
              className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 shadow-[var(--shadow-subtle)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="type-meta">{task.userEvent.lifeEvent.title}</p>
                  <p className="font-semibold text-[color:var(--color-text)]">{task.title}</p>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await updateUserTaskStatus(task.id, UserTaskStatus.DOING, user.id);
                  }}
                >
                  <button className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)] hover:border-[color:var(--color-border-strong)]">
                    Start
                  </button>
                </form>
              </div>
              <p className="text-sm text-[color:var(--color-text-muted)]">
                Keep it moving. Resources are flagged to verify before acting.
              </p>
            </article>
          ))}
          {todos.length === 0 ? (
            <article className="card p-4">
              <p className="type-body text-[color:var(--color-text-muted)]">
                You’re caught up. Check event pages for more steps.
              </p>
            </article>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}
