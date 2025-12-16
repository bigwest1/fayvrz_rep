type TaskStatus = "upcoming" | "active" | "completed";

type TaskCardProps = {
  title: string;
  reason: string;
  status: TaskStatus;
  actionLabel?: string;
  defaultOpen?: boolean;
};

const statusLabel: Record<TaskStatus, string> = {
  upcoming: "Queued",
  active: "In progress",
  completed: "Done",
};

const statusTone: Record<TaskStatus, string> = {
  upcoming:
    "border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-muted)]",
  active:
    "border-[color:var(--color-border-strong)] bg-[color:var(--color-accent-calm)] text-[color:var(--color-text)]",
  completed:
    "border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] text-[color:var(--color-text-muted)]",
};

export function TaskCard({
  title,
  reason,
  status,
  actionLabel = "Action placeholder",
  defaultOpen = false,
}: TaskCardProps) {
  return (
    <details
      data-status={status}
      data-animate="task"
      className="task-card group relative overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-subtle)] transition-colors duration-[var(--motion-base)] ease-[var(--motion-ease-subtle)] [&>summary]:list-none [&>summary::-webkit-details-marker]:hidden"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--color-text-muted)]">
            Task
          </p>
          <h3 className="text-base font-semibold text-[color:var(--color-text)]">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={[
              "rounded-full border px-3 py-1 text-xs font-semibold",
              statusTone[status],
            ].join(" ")}
          >
            {statusLabel[status]}
          </span>
          <span className="rounded-full border border-[color:var(--color-border)] px-2 py-1 text-xs font-semibold text-[color:var(--color-text-muted)] transition-transform duration-[var(--motion-fast)] ease-[var(--motion-ease-standard)] group-open:rotate-45">
            +
          </span>
        </div>
      </summary>

      <div className="task-card__content mt-3 space-y-3">
        <p className="type-body text-[color:var(--color-text-muted)]">{reason}</p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border-strong)] px-4 py-2 text-sm font-semibold text-[color:var(--color-text)] transition-colors duration-[var(--motion-base)] ease-[var(--motion-ease-subtle)] hover:bg-[color:var(--color-accent-calm)]"
          >
            {actionLabel}
          </button>
          <span className="text-xs text-[color:var(--color-text-muted)]">
            Why this matters stays visible first.
          </span>
        </div>
      </div>
    </details>
  );
}
