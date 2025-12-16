import { AppShell } from "@/components/layout/AppShell";

const resources = [
  {
    title: "Local support",
    detail: "Find nearby services and contacts. We add details only after confirmation.",
  },
  {
    title: "Templates",
    detail: "Drafts and forms stay server-side until you decide to send.",
  },
];

export default function ResourcesPage() {
  return (
    <AppShell
      activePath="/resources"
      title="Resources"
      description="Calm, verified references to back each plan step."
    >
      <section className="grid gap-4 md:grid-cols-2">
        {resources.map((item) => (
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
