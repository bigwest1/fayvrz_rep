import Link from "next/link";

const heroSignals = [
  "Steady plans with clear ownership and timing.",
  "Drafts, scripts, and checklists ready for review.",
  "Local resources with context and verification notes.",
  "Server-side handling—no noisy popups or gimmicks.",
];

const pillars = [
  {
    title: "Workspace, not a wizard",
    body: "See everything in one calm surface: priorities now, next, later. No forced steps, just clear options.",
  },
  {
    title: "Proof before commitment",
    body: "Preview a real plan, real scripts, and local resource stubs before you share anything.",
  },
  {
    title: "Assistive, not pushy",
    body: "Autopilot drafts and reminders stay optional. You approve every send or export.",
  },
];

const scenarios: Scenario[] = [
  {
    title: "Job loss",
    summary: "Cash flow triage, benefits, and outreach drafts.",
    cta: "Open preview",
    href: "/example",
  },
  {
    title: "New baby",
    summary: "Leave planning, benefits, and support circle scripts.",
    cta: "See structure",
    href: "/start?template=new-baby",
  },
  {
    title: "Caregiving",
    summary: "Coordination tasks, respite resources, and consent-safe scripts.",
    cta: "See structure",
    href: "/start?template=caregiving",
  },
];

const howItWorks: Step[] = [
  {
    title: "Share your life event",
    detail: "Freeform or pick a moment. We build a draft workspace immediately.",
  },
  {
    title: "Prioritize and personalize",
    detail: "Swap tasks, add timing, and keep context simple for teens or seniors.",
  },
  {
    title: "Act with confidence",
    detail: "Copy scripts, export bundles, or run Autopilot drafts with explicit review.",
  },
];

const workspacePreview: WorkspaceSection[] = [
  {
    label: "Now",
    items: [
      { title: "Stabilize cash for 30 days", meta: "Job loss", affordance: "Copy script" },
      { title: "Confirm health coverage", meta: "Deadline next week", affordance: "Call script" },
    ],
  },
  {
    label: "Next",
    items: [
      { title: "Talk with landlord early", meta: "Keeps options open", affordance: "Auto-draft" },
      { title: "Back up work samples", meta: "Before accounts close", affordance: "Reminder" },
    ],
  },
  {
    label: "Resources",
    items: [
      { title: "County workforce center", meta: "Verify details before visiting", affordance: "Map + call" },
      { title: "Healthcare navigator", meta: "State verified contact", affordance: "Call script" },
    ],
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 justify-center bg-neutral-50 px-6 py-16 sm:py-20 lg:py-24">
      <div className="w-full max-w-6xl space-y-14 lg:space-y-16">
        <header className="grid gap-10 rounded-3xl border border-neutral-200 bg-white/90 p-8 shadow-sm backdrop-blur sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-neutral-900" />
              Calm guidance, built for action
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl">
                Turn hard life events into clear next steps.
              </h1>
              <p className="max-w-2xl text-lg text-neutral-700">
                Fayvrz gives you a focused workspace with tasks, scripts, and local resources ready to use.
                No gradients. No pressure. Just capable support for real life events.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/example"
                className="inline-flex items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-5 py-3 text-base font-semibold text-neutral-50 shadow-sm transition-colors hover:bg-neutral-800"
              >
                Preview a real plan
              </Link>
              <Link
                href="/start"
                className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-5 py-3 text-base font-semibold text-neutral-900 transition-colors hover:border-neutral-400 hover:bg-white"
              >
                Start with your situation
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {pillars.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-relaxed text-neutral-800 shadow-sm"
                >
                  <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                  <p className="mt-1 text-sm text-neutral-700">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <WorkspacePreview sections={workspacePreview} signals={heroSignals} />
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-neutral-600">
                  Scenarios you can trust
                </p>
                <h2 className="text-2xl font-semibold text-neutral-900">See value before you commit.</h2>
              </div>
              <Link
                href="/example"
                className="hidden items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-50 shadow-sm transition-colors hover:bg-neutral-800 md:inline-flex"
              >
                View example
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {scenarios.map((scenario) => (
                <ScenarioCard key={scenario.title} scenario={scenario} />
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-neutral-600">
              How it works
            </p>
            <div className="mt-4 space-y-4">
              {howItWorks.map((step, index) => (
                <StepCard key={step.title} step={step} index={index} />
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-900/90 px-4 py-3 text-sm text-neutral-50 shadow-sm">
              Privacy first, no surprise charges, and every action has a fallback you control.
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-neutral-600">
                Done-for-you readiness
              </p>
              <h3 className="text-2xl font-semibold text-neutral-900">Workspace + Output Studio.</h3>
              <p className="max-w-3xl text-sm text-neutral-700">
                Plans live in the app. Scripts, checklists, and resource bundles export cleanly so you
                can share or act without reformatting. Autopilot stays assistive—never pushy.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/events/demo"
                className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
              >
                Peek at the workspace
              </Link>
              <Link
                href="/start"
                className="inline-flex items-center justify-center rounded-lg border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-50 shadow-sm transition-colors hover:bg-neutral-800"
              >
                Start free
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

type Scenario = {
  title: string;
  summary: string;
  cta: string;
  href: string;
};

function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-600">
          {scenario.title}
        </p>
        <p className="text-sm text-neutral-800">{scenario.summary}</p>
      </div>
      <Link
        href={scenario.href}
        className="mt-3 inline-flex w-fit items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-3 py-2 text-xs font-semibold text-neutral-50 transition-colors hover:bg-neutral-800"
      >
        {scenario.cta}
      </Link>
    </article>
  );
}

type Step = {
  title: string;
  detail: string;
};

function StepCard({ step, index }: { step: Step; index: number }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 p-4 shadow-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-sm font-semibold text-neutral-900">
        {index + 1}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-neutral-900">{step.title}</p>
        <p className="text-sm text-neutral-700">{step.detail}</p>
      </div>
    </div>
  );
}

type WorkspaceSection = {
  label: string;
  items: { title: string; meta: string; affordance: string }[];
};

function WorkspacePreview({
  sections,
  signals,
}: {
  sections: WorkspaceSection[];
  signals: string[];
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-neutral-600">
        What you see inside
      </p>
      <div className="space-y-3">
        {signals.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-white px-4 py-3"
          >
            <span className="mt-1 h-2 w-2 rounded-full bg-neutral-900" />
            <p className="text-sm text-neutral-800">{item}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {sections.map((section) => (
          <div
            key={section.label}
            className="space-y-2 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-600">
                {section.label}
              </p>
              <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] font-semibold text-neutral-700">
                Calm
              </span>
            </div>
            <div className="space-y-2">
              {section.items.map((item) => (
                <div key={item.title} className="space-y-1 rounded-xl border border-neutral-100 bg-neutral-50 p-2">
                  <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                  <p className="text-xs text-neutral-700">{item.meta}</p>
                  <p className="text-[11px] font-semibold text-neutral-800">{item.affordance}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-neutral-600">
        No gradients or gimmicks. Just clear priorities, steady pacing, and room to breathe.
      </p>
    </div>
  );
}
