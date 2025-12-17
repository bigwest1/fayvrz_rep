import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { requireUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import { validateLifeEventDefinition } from "@/lib/events/lifeEvent.validate";
import { recordAudit } from "@/lib/audit";

export default async function AdminContentPage() {
  const user = await requireUser();
  if (user.role !== "ADMIN" && user.role !== "OWNER") {
    redirect("/admin");
  }

  async function saveEvent(formData: FormData) {
    "use server";
    const actor = await requireUser();
    if (actor.role !== "ADMIN" && actor.role !== "OWNER") return;

    const raw = formData.get("definition")?.toString();
    const featureFlag = formData.get("featureFlag")?.toString().trim() || null;
    const published = formData.get("published") === "on";
    if (!raw) return;
    let json: any;
    try {
      json = JSON.parse(raw);
    } catch {
      return;
    }

    const validation = validateLifeEventDefinition(json);
    if (!validation.ok) {
      await recordAudit("ADMIN_EVENT_VALIDATION_FAILED", { error: validation.error }, actor.id);
      return;
    }

    const def = validation.value;

    const lifeEvent = await prisma.lifeEvent.upsert({
      where: { slug: def.id },
      update: {
        title: def.title,
        description: def.disclaimers?.join(" ") ?? "Structured life event.",
        tags: def.triggers?.keywords ?? [],
        featureFlag,
        published,
      },
      create: {
        slug: def.id,
        title: def.title,
        description: def.disclaimers?.join(" ") ?? "Structured life event.",
        tags: def.triggers?.keywords ?? [],
        featureFlag,
        published,
      },
    });

    // Sync tasks (minimal mapping: why -> purpose, urgency -> priority)
    for (const task of def.tasks) {
      await prisma.taskTemplate.upsert({
        where: { lifeEventId_title: { lifeEventId: lifeEvent.id, title: task.title } },
        update: {
          purpose: `${task.why} | Fallback: ${task.fallback}`,
          priority: task.urgency === "NOW" ? "URGENT" : task.urgency === "NEXT" ? "HIGH" : "MEDIUM",
        },
        create: {
          lifeEventId: lifeEvent.id,
          title: task.title,
          purpose: `${task.why} | Fallback: ${task.fallback}`,
          priority: task.urgency === "NOW" ? "URGENT" : task.urgency === "NEXT" ? "HIGH" : "MEDIUM",
        },
      });
    }

    await recordAudit("ADMIN_EVENT_SAVED", { eventId: lifeEvent.id, featureFlag, published }, actor.id, {
      type: "LifeEvent",
      id: lifeEvent.id,
    });
  }

  return (
    <AppShell
      activePath="/admin"
      title="Admin · Content"
      description="Author life events via DSL, validate, preview, and control rollout."
    >
      <section className="card space-y-3 p-5">
        <p className="type-meta">Life event DSL</p>
        <form action={saveEvent} className="space-y-2">
          <textarea
            name="definition"
            rows={12}
            className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm"
            placeholder='Paste LifeEventDefinition JSON here'
          />
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-sm text-[color:var(--color-text)]">
              <input type="checkbox" name="published" defaultChecked className="h-4 w-4" /> Published
            </label>
            <input
              type="text"
              name="featureFlag"
              placeholder="feature_flag_key (optional)"
              className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm"
            />
          </div>
          <button className="rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-4 py-2 text-sm font-semibold text-[color:var(--color-surface)]">
            Validate & Save
          </button>
        </form>
        <p className="text-xs text-[color:var(--color-text-muted)]">
          Validation required; unpublished + featureFlag keeps events dark until rollout.
        </p>
      </section>
    </AppShell>
  );
}
