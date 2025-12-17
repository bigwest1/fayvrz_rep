import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser, getProfileSignals } from "@/lib/currentUser";
import { AppShell } from "@/components/layout/AppShell";
import { FocusCard } from "@/components/ux";

type Props = { params: { slug: string } };

export default async function EventStudioPage({ params }: Props) {
  const user = await requireUser();
  const event = await prisma.lifeEvent.findUnique({
    where: { slug: params.slug },
    include: { tasks: { include: { scripts: true, resources: true } } },
  });
  if (!event) notFound();
  const profile = await getProfileSignals();
  const firstTask = event.tasks[0];

  const outputs = {
    email: firstTask?.scripts.find((s) => s.channel === "EMAIL"),
    phone: firstTask?.scripts.find((s) => s.channel === "PHONE"),
    checklist: [
      "Confirm what’s needed",
      "Gather docs",
      "Verify costs and deadlines",
      "Note contact details",
    ],
    resources: firstTask?.resources.slice(0, 3) ?? [],
  };

  return (
    <AppShell
      activePath={`/events/${params.slug}`}
      title={`${event.title} · Studio`}
      description="Exportable drafts, scripts, and resources ready to act on."
    >
      <FocusCard status="studio">
        <p className="type-meta">Bundle export</p>
        <p className="type-body text-[color:var(--color-text-muted)]">
          Download a markdown bundle with tasks, scripts, and resources. Everything is marked “verify details.”
        </p>
        <form action={`/api/export/script`} method="post" className="pt-2">
          <input type="hidden" name="scriptTemplateId" value={outputs.email?.id ?? ""} />
          <button className="rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-4 py-2 text-sm font-semibold text-[color:var(--color-surface)]">
            Download bundle
          </button>
        </form>
      </FocusCard>

      <div className="grid gap-4 md:grid-cols-2">
        <FocusCard status="email">
          <p className="type-meta">Email draft</p>
          <p className="text-sm text-[color:var(--color-text-muted)]">{outputs.email?.subject ?? "Request"}</p>
          <pre className="whitespace-pre-wrap rounded-[var(--radius-md)] bg-[color:var(--color-surface-muted)] p-3 text-sm text-[color:var(--color-text)]">
            {outputs.email?.bodyMarkdown ??
              `Hello,\n\nI’m reaching out about ${event.title}. I’m in ${profile.location ?? "your area"}. Please share next steps and timing.\n\nThank you.`}
          </pre>
          <div className="flex gap-2 pt-2">
            <button className="rounded-full border border-[color:var(--color-text)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)]">
              Copy
            </button>
            <button className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)]">
              Download .md
            </button>
          </div>
        </FocusCard>

        <FocusCard status="call">
          <p className="type-meta">Call script</p>
          <pre className="whitespace-pre-wrap rounded-[var(--radius-md)] bg-[color:var(--color-surface-muted)] p-3 text-sm text-[color:var(--color-text)]">
            Hi, this is {profile.displayName}. I’m calling about {event.title}. I’m in {profile.location ?? "your area"}. What do you need from me and what timing should I expect?
          </pre>
          <div className="flex gap-2 pt-2">
            <button className="rounded-full border border-[color:var(--color-text)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)]">
              Copy
            </button>
          </div>
        </FocusCard>

        <FocusCard status="checklist">
          <p className="type-meta">Checklist</p>
          <ul className="space-y-1 text-sm text-[color:var(--color-text)]">
            {outputs.checklist.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[color:var(--color-border-strong)]" />
                {item}
              </li>
            ))}
          </ul>
        </FocusCard>

        <FocusCard status="resources">
          <p className="type-meta">Resources</p>
          <ul className="space-y-1 text-sm text-[color:var(--color-text)]">
            {outputs.resources.map((res) => (
              <li key={res.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{res.title}</p>
                  <p className="text-xs text-[color:var(--color-text-muted)]">Verify details locally.</p>
                </div>
                {res.url ? (
                  <a href={res.url} className="text-xs font-semibold text-[color:var(--color-text)] underline">
                    Open
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </FocusCard>
      </div>
    </AppShell>
  );
}
