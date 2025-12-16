import { AppShell } from "@/components/layout/AppShell";
import { LifeEventCard } from "@/components/life-events/LifeEventCard";
import { TaskCard } from "@/components/life-events/TaskCard";

type Task = {
  title: string;
  reason: string;
  status: "upcoming" | "active" | "completed";
  actionLabel?: string;
  defaultOpen?: boolean;
};

const tasks: Task[] = [
  {
    title: "File for unemployment benefits",
    reason: "Starts the income bridge and sets weekly expectations before deadlines stack up.",
    status: "active",
    actionLabel: "Start filing",
    defaultOpen: true,
  },
  {
    title: "Confirm health coverage options",
    reason: "Compare COBRA and marketplace dates now to avoid gaps and surprise bills.",
    status: "active",
    actionLabel: "Review coverage paths",
  },
  {
    title: "Review severance and last paycheck",
    reason: "Check PTO payout, non-compete language, and final taxes while details are fresh.",
    status: "active",
    actionLabel: "Open checklist",
  },
  {
    title: "Stabilize essentials for the next 8 weeks",
    reason: "Prioritize housing, food, and utilities first so you can plan the search calmly.",
    status: "upcoming",
    actionLabel: "Draft budget note",
  },
  {
    title: "Notify landlord or lenders early",
    reason: "Early notice keeps options open for payment plans instead of urgent notices later.",
    status: "upcoming",
    actionLabel: "Draft outreach",
  },
  {
    title: "Back up work samples and contacts",
    reason: "Save references and portfolio pieces before accounts close so you stay ready.",
    status: "completed",
    actionLabel: "Review saved items",
  },
  {
    title: "Set a weekly search rhythm",
    reason: "Block time for applications, outreach, and rest to prevent burnout in week one.",
    status: "upcoming",
    actionLabel: "Outline routine",
  },
];

export default function ExampleLifePlanPage() {
  return (
    <AppShell
      activePath="/life-plans"
      title="Job loss example plan"
      description="A calm outline for the first month after a job ends. No personal data is captured yet—this is a proof of flow."
    >
      <LifeEventCard
        title="Job loss"
        status="active"
        context="Keep income, coverage, and communication aligned so the search starts steady."
        primaryAction={{ label: "Resume plan", href: "/life-plans/example" }}
        secondaryAction={{ label: "Preview steps", href: "#tasks" }}
      />

      <section id="tasks" className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="type-meta">Immediate steps</p>
            <p className="type-body max-w-3xl">
              Short, plain-language tasks with context first. Actions stay deliberate so you can skim
              and act without rushing.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-xs font-semibold text-[color:var(--color-text-muted)]">
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-border-strong)]" />
            4-week horizon
          </div>
        </div>

        <div className="grid gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.title} {...task} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
