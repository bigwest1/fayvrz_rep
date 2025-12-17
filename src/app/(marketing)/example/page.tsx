const nowTasks = [
  {
    title: "Stabilize weekly cash",
    reason: "File for unemployment, pause non-essentials, and confirm first payouts.",
    action: "Draft claim email",
  },
  {
    title: "Protect health coverage",
    reason: "Compare COBRA vs marketplace timelines before coverage gaps appear.",
    action: "Call script ready",
  },
];

const nextTasks = [
  {
    title: "Review severance and last paycheck",
    reason: "Check PTO, non-compete, and deductions so you know your footing.",
    action: "Checklist ready",
  },
  {
    title: "Talk with landlord or lender early",
    reason: "Early notice keeps options open for payment plans instead of urgent notices later.",
    action: "Auto-draft message",
  },
  {
    title: "Back up work samples and contacts",
    reason: "Preserve references and portfolio access before accounts close.",
    action: "Reminder",
  },
];

const laterTasks = [
  {
    title: "Refresh resume and profiles",
    reason: "Keep facts current so outreach feels calm, not rushed.",
    action: "Exportable draft",
  },
  {
    title: "Line up references and short proofs",
    reason: "Collect ready signals for applications without scrambling.",
    action: "Copy script",
  },
  {
    title: "Identify local workforce resources",
    reason: "Find nearby centers, job clubs, and legal aid with eligibility notes.",
    action: "Resource lookup",
  },
];

const outputs = [
  {
    title: "Email to landlord",
    snippet: "I wanted to give you a clear update and propose a short-term plan so rent stays on track...",
  },
  {
    title: "Health coverage call script",
    snippet: "Hi, I'm comparing COBRA and marketplace timing. I need to confirm coverage start dates and premiums...",
  },
  {
    title: "Action bundle",
    snippet: "Checklist, resource links, and reminders packaged in one exportable note.",
  },
];

export default function ExamplePlanPage() {
  return (
    <main className="flex flex-1 justify-center bg-neutral-50 px-6 py-16 sm:py-20 lg:py-24">
      <div className="w-full max-w-6xl space-y-10">
        <div className="flex flex-col gap-6 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-neutral-600">
                Example plan · Workspace preview
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                Job loss: steady steps for the first month
              </h1>
              <p className="max-w-3xl text-sm text-neutral-700">
                A calm, human layout that shows what you act on now, next, and later. Every task has a
                reason, a script or checklist, and a fallback if automation is off.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-800">
                Local resources ready
              </span>
              <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-800">
                Exports included
              </span>
              <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-800">
                Autopilot optional
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm">
              <p className="text-sm font-semibold text-neutral-900">Steady pacing</p>
              <p className="text-sm text-neutral-700">Now, next, later—so you never feel buried.</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm">
              <p className="text-sm font-semibold text-neutral-900">Why it matters</p>
              <p className="text-sm text-neutral-700">Every task shows the “why” to reduce decision fatigue.</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm">
              <p className="text-sm font-semibold text-neutral-900">Ready-to-send drafts</p>
              <p className="text-sm text-neutral-700">Copy or export without wrestling with formats.</p>
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <header className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-neutral-600">Tasks</p>
            <h2 className="text-2xl font-semibold text-neutral-900">Now, Next, Later</h2>
            <p className="max-w-2xl text-sm text-neutral-700">
              Clear states for teens and seniors alike. Each task includes an action you can run, copy,
              or export.
            </p>
          </header>
          <div className="grid gap-4 lg:grid-cols-3">
            <TaskColumn title="Now" accent="border-neutral-900" tasks={nowTasks} />
            <TaskColumn title="Next" accent="border-neutral-800" tasks={nextTasks} />
            <TaskColumn title="Later" accent="border-neutral-700" tasks={laterTasks} />
          </div>
        </section>

        <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-neutral-600">
                Output studio
              </p>
              <h3 className="text-xl font-semibold text-neutral-900">What you can export or copy.</h3>
              <p className="text-sm text-neutral-700">
                Email drafts, call scripts, checklists, and resource bundles—no wizards, no clutter.
              </p>
            </div>
            <div className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold text-neutral-50 shadow-sm">
              Assistive, not pushy
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {outputs.map((output) => (
              <article
                key={output.title}
                className="flex h-full flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm"
              >
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-neutral-900">{output.title}</p>
                  <p className="text-sm text-neutral-700">{output.snippet}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold text-neutral-800">
                    Copy
                  </span>
                  <span className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold text-neutral-800">
                    Export
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

type Task = {
  title: string;
  reason: string;
  action: string;
};

function TaskColumn({
  title,
  accent,
  tasks,
}: {
  title: string;
  accent: string;
  tasks: Task[];
}) {
  return (
    <div className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-900">{title}</p>
        <span className={`h-2 w-2 rounded-full border ${accent}`} />
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <article
            key={task.title}
            className="space-y-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-3 shadow-sm"
          >
            <p className="text-sm font-semibold text-neutral-900">{task.title}</p>
            <p className="text-sm text-neutral-700">{task.reason}</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold text-neutral-800">
                {task.action}
              </span>
              <span className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold text-neutral-800">
                Why it matters
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
