import Link from "next/link";

const valueProps = [
  {
    title: "Actionable plans",
    detail: "Crisp tasks with ownership, timing, and clear outcomes to reduce decision fatigue.",
  },
  {
    title: "Local resources",
    detail: "Surface nearby services and benefits with context so you know why they help.",
  },
  {
    title: "Autopilot help",
    detail: "Draft messages and forms for you to review, keeping control and consent explicit.",
  },
];

const preview = [
  "Stabilize essentials before chasing paperwork.",
  "Stay ahead of deadlines with simple reminders.",
  "See why each task matters before you commit time.",
  "Keep your information safe with server-side handling.",
];

export default function Home() {
  return (
    <main className="flex flex-1 justify-center px-6 py-16 sm:py-20 lg:py-24">
      <div className="w-full max-w-6xl space-y-14 lg:space-y-16">
        <header className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-neutral-900" />
              Calm guidance for real life moments
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl">
              Know your next step.
            </h1>
            <p className="max-w-2xl text-lg text-neutral-700">
              Fayvrz gives you a steady plan, connects you to trusted resources, and handles the
              routine drafting so you can focus on decisions that matter.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/example"
                className="inline-flex items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-5 py-3 text-base font-semibold text-neutral-50 shadow-sm transition-colors hover:bg-neutral-800"
              >
                See an example plan
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-5 py-3 text-base font-semibold text-neutral-900 transition-colors hover:border-neutral-400 hover:bg-white"
              >
                Sign in
              </Link>
            </div>
          </div>
          <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-neutral-600">
              What a plan feels like
            </p>
            <div className="space-y-3">
              {preview.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-neutral-900" />
                  <p className="text-sm text-neutral-800">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-neutral-600">
              No gradients or gloss. Just clear priorities, steady pacing, and room to breathe.
            </p>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {valueProps.map((item) => (
            <div
              key={item.title}
              className="flex h-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-neutral-900">{item.title}</h2>
                <p className="text-sm leading-relaxed text-neutral-700">{item.detail}</p>
              </div>
              <div className="mt-4 h-px w-full bg-neutral-200" />
              <div className="pt-3 text-sm font-medium text-neutral-800">Built for calm focus.</div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-neutral-600">
                Dual-track readiness
              </p>
              <h3 className="text-2xl font-semibold text-neutral-900">
                Marketing and app spaces stay in sync.
              </h3>
              <p className="max-w-2xl text-sm text-neutral-700">
                Public stories live in marketing. Secure actions live in the app. The shell keeps both
                steady so you can ship without drift.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/example"
                className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
              >
                Review an example
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-lg border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-50 shadow-sm transition-colors hover:bg-neutral-800"
              >
                Get started
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
