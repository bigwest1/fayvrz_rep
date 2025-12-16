import { AppShell } from "@/components/layout/AppShell";

const highlights = [
  {
    title: "Current focus",
    detail: "Keep momentum on your active plan without juggling tools.",
  },
  {
    title: "Steady pacing",
    detail: "We balance urgency with calm steps that respect your time.",
  },
];

export default function HomePage() {
  return (
    <AppShell
      activePath="/home"
      title="Home"
      description="A calm starting point for your current life events and resources."
    >
      <section className="grid gap-4 md:grid-cols-2">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="card space-y-2 p-5 transition-colors hover:border-[color:var(--color-border-strong)]"
          >
            <p className="type-meta">{item.title}</p>
            <p className="type-body">{item.detail}</p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
