import { notFound } from "next/navigation";
import Link from "next/link";
import { UserTaskStatus, JobType } from "@prisma/client";
import { AppShell } from "@/components/layout/AppShell";
import { ResourceList } from "@/components/resources/ResourceList";
import { ScriptCard } from "@/components/resources/ScriptCard";
import { TaskStatusToggle } from "@/components/resources/TaskStatusToggle";
import { MomentBanner } from "@/components/patterns/MomentBanner";
import { ResourceDrawer } from "@/components/patterns/ResourceDrawer";
import { ConfidencePanel, FocusCard, ProgressRail, Reveal } from "@/components/ux";
import { requireUser, getProfileSignals } from "@/lib/currentUser";
import {
  ensureUserEvent,
  getLifeEventBySlug,
  updateUserTaskStatus,
} from "@/lib/events";
import { enqueueJob } from "@/lib/jobs/queue";
import { prisma } from "@/lib/prisma";
import { enforceUsageOrUpsell, consumeUsage } from "@/lib/billing/enforce";

type Props = {
  params: { slug: string };
};

export default async function EventDetailPage({ params }: Props) {
  const user = await requireUser();
  const lifeEvent = await getLifeEventBySlug(params.slug);
  if (!lifeEvent) {
    notFound();
  }

  const userEvent = await ensureUserEvent(params.slug, user.id);
  if (!userEvent) {
    notFound();
  }

  const userTasks = await prisma.userTask.findMany({
    where: { userEventId: userEvent.id },
  });
  const profile = await getProfileSignals();
  const now = userTasks.filter((t) => t.status !== UserTaskStatus.DONE).slice(0, 2);
  const next = userTasks.filter((t) => t.status !== UserTaskStatus.DONE).slice(2, 4);
  const later = userTasks.filter((t) => t.status !== UserTaskStatus.DONE).slice(4);

  async function handleStatusChange(formData: FormData) {
    "use server";
    const taskId = formData.get("taskId")?.toString();
    const status = formData.get("status")?.toString() as UserTaskStatus;
    if (!taskId || !status) return;
    const currentUser = await requireUser();
    await updateUserTaskStatus(taskId, status, currentUser.id);
  }

  async function generateResources(taskTemplateId: string, taskTitle: string) {
    "use server";
    const currentUser = await requireUser();
    const signals = await getProfileSignals();
    const usage = await enforceUsageOrUpsell(currentUser.id, "LOCAL_RESOURCE_REFRESHES_PER_MONTH");
    if (!usage.ok) {
      return;
    }
    await enqueueJob(currentUser.id, JobType.GENERATE_RESOURCES_FOR_TASK, {
      taskTemplateId,
      queryKey: `${taskTemplateId}:${signals.location ?? "generic"}`,
      query: `${taskTitle} ${signals.location ?? ""}`.trim(),
      context: {
        location: {
          city: signals.location?.split(",")?.[0]?.trim(),
          state: signals.location?.split(",")?.[1]?.trim(),
        },
        category: params.slug,
        taskTitle,
      },
    });
    await consumeUsage(currentUser.id, "LOCAL_RESOURCE_REFRESHES_PER_MONTH");
  }

  const taskResources = await prisma.localResource.findMany({
    where: { userId: user.id, taskTemplateId: { in: lifeEvent.tasks.map((t) => t.id) } },
  });

  return (
    <AppShell
      activePath="/events"
      title={lifeEvent.title}
      description={lifeEvent.description}
    >
      <MomentBanner
        label="Event"
        title={`${lifeEvent.icon ? `${lifeEvent.icon} ` : ""}${lifeEvent.title}`}
        nextAction="Tasks include resources and scripts. Everything is marked as “verify details” before you act."
        ctaLabel="Back home"
        ctaHref="/home"
        secondaryLabel="Calm + capable"
      />

      <ConfidencePanel
        handles={[
          { label: "Resource search + verify tags", detail: "Always marked “verify details”." },
          { label: "Script drafts", detail: "Email + call, ready to copy." },
        ]}
        youDo={[
          { label: "Decide and act", detail: "Choose the option that fits you." },
          { label: "Keep us updated", detail: "Mark tasks so pacing stays right." },
        ]}
        options={["Export bundle", "Reminders", "Autopilot drafts"]}
      />

      <section className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <p className="type-meta">Progress</p>
          <ProgressRail
            steps={[
              ...now.map((t) => ({ id: t.id, label: t.title, status: "now" as const })),
              ...next.map((t) => ({ id: t.id, label: t.title, status: "next" as const })),
              ...later.map((t) => ({ id: t.id, label: t.title, status: "later" as const })),
            ]}
          />
        </div>
        <div className="space-y-3">
          <p className="type-meta">Summary</p>
          <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
            <p className="text-sm text-[color:var(--color-text-muted)]">
              Last updated {new Date(userEvent.updatedAt).toLocaleString()}
            </p>
            <p className="text-sm text-[color:var(--color-text-muted)]">Status: {userEvent.status}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {lifeEvent.tasks.map((task, idx) => {
          const userTask = userTasks.find((t) => t.title === task.title);
          const cached = taskResources.filter((r) => r.taskTemplateId === task.id);
          return (
            <Reveal key={task.id} delay={idx * 0.05}>
              <FocusCard status={userTask?.status ?? "todo"}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="type-meta">Task</p>
                    <p className="text-lg font-semibold text-[color:var(--color-text)]">{task.title}</p>
                    <p className="type-body text-[color:var(--color-text-muted)]">{task.purpose}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {userTask ? (
                    <TaskStatusToggle
                      current={userTask.status}
                      taskId={userTask.id}
                      action={handleStatusChange}
                    />
                  ) : null}
                  <form action={() => generateResources(task.id, task.title)}>
                    <button className="rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-4 py-2 text-xs font-semibold text-[color:var(--color-surface)] hover:opacity-90">
                      Generate resources
                    </button>
                  </form>
                </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="type-meta">Resources</p>
                  <ResourceDrawer
                    triggerLabel="Open drawer"
                    groups={[
                      {
                        label: "Templates",
                        items: task.resources.map((res) => ({
                          title: res.title,
                          description: res.description,
                          url: res.url ?? undefined,
                          phone: res.phone ?? undefined,
                        })),
                      },
                      {
                        label: "Local suggestions",
                        items: cached.map((res) => ({
                          title: res.label,
                          description: "Verify details locally before acting.",
                          url: res.url ?? undefined,
                          phone: res.phone ?? undefined,
                        })),
                      },
                    ]}
                  />
                </div>
                <ResourceList
                  resources={[
                    ...task.resources.map((res) => ({
                      id: res.id,
                      type: res.type,
                      label: res.title,
                      description: res.description,
                      url: res.url ?? undefined,
                      phone: res.phone ?? undefined,
                      addressText: res.addressText ?? undefined,
                      source: "template",
                    })),
                    ...cached.map((res) => ({
                      id: res.id,
                      label: res.label,
                      kind: res.kind,
                      url: res.url ?? undefined,
                      phone: res.phone ?? undefined,
                      addressText: res.addressText ?? undefined,
                      source: "local-cache",
                    })),
                  ]}
                />
                </div>

                <div className="space-y-2">
                  <p className="type-meta">Scripts</p>
                  <div className="grid gap-2 md:grid-cols-2">
                  {task.scripts.map((script) => (
                    <ScriptCard
                      key={script.id}
                      scriptTemplateId={script.id}
                      channel={script.channel}
                      subject={script.subject}
                      preview={script.bodyMarkdown}
                      variables={{
                        name: user.displayName,
                        city: profile.location?.split(",")?.[0]?.trim(),
                        state: profile.location?.split(",")?.[1]?.trim(),
                      }}
                    />
                  ))}
                  </div>
                </div>
              </FocusCard>
            </Reveal>
          );
        })}
      </section>
    </AppShell>
  );
}
