import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { MomentBanner } from "@/components/patterns/MomentBanner";
import { ActionCard } from "@/components/patterns/ActionCard";
import { ConfidenceTimeline } from "@/components/patterns/ConfidenceTimeline";
import { requireUser } from "@/lib/currentUser";
import { ensureUserEvent } from "@/lib/events";
import { prisma } from "@/lib/prisma";

const examples = [
  { slug: "new-baby", title: "New baby arriving", line: "Coverage, care, and leave lined up." },
  { slug: "job-loss", title: "Job loss", line: "Steady income, coverage, and outreach." },
  {
    slug: "washing-machine-broke",
    title: "Washing machine broke",
    line: "Bridge the gap while you repair or replace.",
  },
];

export default async function StartPage() {
  const user = await requireUser();

  async function handleFreeform(formData: FormData) {
    "use server";
    const text = (formData.get("freeform") ?? "").toString().toLowerCase();
    const events = await prisma.lifeEvent.findMany();
    const match =
      events.find((e) => text.includes(e.slug)) ||
      events.find((e) => text.includes(e.title.toLowerCase())) ||
      events[0];
    if (match) {
      const created = await ensureUserEvent(match.slug, user.id);
      if (created) {
        redirect(`/events/${match.slug}`);
      }
    }
  }

  async function handleChoose(slug: string) {
    "use server";
    const created = await ensureUserEvent(slug, user.id);
    if (created) {
      redirect(`/events/${slug}`);
    }
  }

  const sampleEvent = examples[0];

  return (
    <AppShell
      activePath="/start"
      title="Start with a real example"
      description="See how Fayvrz handles a life moment before you type anything. No steps hidden, no wizard."
    >
      <MomentBanner
        label="Preview"
        title={`${sampleEvent.title} — here’s what matters this week.`}
        nextAction="We’ll show tasks, why they matter, and resources you can verify."
        ctaLabel="View sample plan"
        ctaHref={`/events/${sampleEvent.slug}`}
      />

      <section className="grid gap-4 md:grid-cols-2">
        <form action={handleFreeform} className="card space-y-3 p-5">
          <p className="type-meta">Describe your situation</p>
          <p className="type-body text-[color:var(--color-text-muted)]">
            Plain language works. We’ll map it to the closest life moment and show tasks instantly.
          </p>
          <textarea
            name="freeform"
            rows={3}
            placeholder="Example: I was laid off last week, need benefits and coverage options."
            className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-border-strong)] focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-4 py-2 text-sm font-semibold text-[color:var(--color-surface)] hover:opacity-90"
          >
            Match and continue
          </button>
        </form>

        <div className="card space-y-3 p-5">
          <p className="type-meta">Pick a life moment</p>
          <div className="grid gap-2">
            {examples.map((item) => (
              <form key={item.slug} action={() => handleChoose(item.slug)}>
                <button
                  type="submit"
                  className="flex w-full items-center justify-between rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-left text-sm font-semibold text-[color:var(--color-text)] hover:border-[color:var(--color-border-strong)]"
                >
                  <span>
                    {item.title}
                    <span className="block text-xs font-normal text-[color:var(--color-text-muted)]">
                      {item.line}
                    </span>
                  </span>
                  <span aria-hidden>→</span>
                </button>
              </form>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <p className="type-meta">What we do for you</p>
        <div className="grid gap-3 md:grid-cols-3">
          {examples.map((example) => (
            <ActionCard
              key={example.slug}
              title={example.title}
              why={example.line}
              timeEstimate="15–45 min"
              confidence="ready"
              primaryLabel="Open example"
              primaryHref={`/events/${example.slug}`}
              onCopy={async () => navigator.clipboard.writeText(example.title)}
            />
          ))}
        </div>
      </section>

      <ConfidenceTimeline
        phases={[
          { title: "Preview", detail: "See tasks and scripts immediately.", ownership: "we" },
          { title: "Adjust signals", detail: "Add your location and context.", ownership: "you" },
          { title: "Generate resources", detail: "We suggest; you verify.", ownership: "we" },
          { title: "Act", detail: "Copy scripts or call from the app.", ownership: "you" },
        ]}
      />
    </AppShell>
  );
}
