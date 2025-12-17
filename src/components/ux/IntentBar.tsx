import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/currentUser";

type Props = {
  placeholder?: string;
  className?: string;
};

export function IntentBar({ placeholder = "What’s happening?", className }: Props) {
  async function createDraft(formData: FormData) {
    "use server";
    const user = await requireUser();
    const note = (formData.get("intent") ?? "").toString().trim();
    if (!note) return;
    await prisma.auditLog.create({
      data: {
        actorUserId: user.id,
        action: "INTENT_NOTE",
        targetType: "Note",
        metadataJson: { note },
      },
    });
    revalidatePath("/home");
  }

  return (
    <form action={createDraft} className={["flex flex-col gap-2 rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-subtle)] sm:flex-row sm:items-center", className].filter(Boolean).join(" ")}>
      <input
        name="intent"
        placeholder={placeholder}
        className="flex-1 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-border-strong)] focus:outline-none"
        aria-label="Describe your situation"
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-4 py-2 text-sm font-semibold text-[color:var(--color-surface)]"
        >
          Create draft event
        </button>
        <a
          href="/start"
          className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold text-[color:var(--color-text)]"
        >
          Pick an event
        </a>
      </div>
    </form>
  );
}
