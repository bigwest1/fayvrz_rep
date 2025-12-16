const tasks = [
  {
    title: "File for unemployment benefits",
    reason: "Starts the income bridge and helps you understand weekly requirements now, not later.",
  },
  {
    title: "Confirm health coverage options",
    reason: "Avoids coverage gaps; compare COBRA vs marketplace timelines before deadlines hit.",
  },
  {
    title: "Review severance and last paycheck details",
    reason: "Checks payouts, PTO, and non-compete clauses so you know what obligations remain.",
  },
  {
    title: "Stabilize cash flow for 60 days",
    reason: "Prioritize essentials and pause non-critical spending to buy time for the search.",
  },
  {
    title: "Talk with landlord or lenders early",
    reason: "Early notice keeps options open for payment plans instead of urgent notices later.",
  },
  {
    title: "Back up work samples and contacts",
    reason: "Preserves your portfolio and references before accounts close.",
  },
  {
    title: "Refresh resume and profiles",
    reason: "Positions you for outreach with current facts; avoids rushed edits before an interview.",
  },
  {
    title: "Set a steady daily routine",
    reason: "Blocks time for search, learning, and rest so you do not burn out.",
  },
  {
    title: "Identify local workforce resources",
    reason: "Finds nearby centers, job clubs, and legal aid with context for eligibility.",
  },
  {
    title: "Line up references and short proofs",
    reason: "Gives you ready signals and quick stories for applications without scrambling.",
  },
];

export default function ExamplePlanPage() {
  return (
    <main className="flex flex-1 justify-center px-6 py-16 sm:py-20 lg:py-24">
      <div className="w-full max-w-6xl space-y-10">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-neutral-600">
            Example plan
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Job loss: steady steps for the first month
          </h1>
          <p className="max-w-3xl text-sm text-neutral-700">
            Use this as a sample structure. Replace with your state, dates, and contacts. Each task
            includes why it matters and a placeholder to auto-draft a message when you are ready.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          {tasks.map((task, index) => (
            <article
              key={task.title}
              className="flex h-full flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-600">
                    Step {index + 1}
                  </p>
                  <h2 className="text-lg font-semibold text-neutral-900">{task.title}</h2>
                </div>
                <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700">
                  Priority
                </span>
              </div>
              <p className="text-sm leading-relaxed text-neutral-700">{task.reason}</p>
              <div className="mt-auto flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex w-fit items-center justify-center rounded-lg border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-50 shadow-sm transition-colors hover:bg-neutral-800"
                >
                  Auto-draft message
                </button>
                <p className="text-xs text-neutral-600">Placeholder until your details are added.</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
