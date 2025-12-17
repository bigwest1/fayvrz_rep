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

const scenarios = [
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

const howItWorks = [
  {
    title: "Tell us what's happening",
    detail: "Freeform or pick a life moment. We build a draft workspace immediately.",
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
                Know your next move without the noise.
              </h1>
              <p className="max-w-2xl text-lg text-neutral-700">
                Fayvrz gives you a focused workspace with tasks, scripts, and local resources ready to
                use. No gradients. No pressure. Just capable support for real life moments.
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
          <div className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-neutral-600">
              What you see inside
            </p>
            <div className="space-y-3">
              {heroSignals.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-white px-4 py-3"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-neutral-900" />
                  <p className="text-sm text-neutral-800">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-neutral-600">
              No gradients or gimmicks. Just clear priorities, steady pacing, and room to breathe.
            </p>
          </div>
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
                <article
                  key={scenario.title}
                  className="flex h-full flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm"
                >
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
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-neutral-600">
              How it works
            </p>
            <div className="mt-4 space-y-4">
              {howItWorks.map((step, index) => (
                <div
                  key={step.title}
                  className="flex gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 p-4 shadow-sm"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-sm font-semibold text-neutral-900">
                    {index + 1}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-neutral-900">{step.title}</p>
                    <p className="text-sm text-neutral-700">{step.detail}</p>
                  </div>
                </div>
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
