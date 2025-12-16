import Link from "next/link";

export type LifeEventStatus = "upcoming" | "active" | "completed";

type CardAction = {
  label: string;
  href: string;
};

type LifeEventCardProps = {
  title: string;
  context: string;
  status: LifeEventStatus;
  primaryAction: CardAction;
  secondaryAction?: CardAction;
};

const statusLabel: Record<LifeEventStatus, string> = {
  upcoming: "Upcoming",
  active: "Active now",
  completed: "Completed",
};

const statusAccent: Record<LifeEventStatus, string> = {
  upcoming: "bg-[color:var(--color-border)]",
  active: "bg-[color:var(--color-accent-contrast)]",
  completed: "bg-[color:var(--color-border-strong)]",
};

const statusTone: Record<LifeEventStatus, string> = {
  upcoming:
    "border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-muted)]",
  active:
    "border-[color:var(--color-border-strong)] bg-[color:var(--color-accent-calm)] text-[color:var(--color-text)]",
  completed:
    "border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] text-[color:var(--color-text-muted)]",
};

export function LifeEventCard({
  title,
  context,
  status,
  primaryAction,
  secondaryAction,
}: LifeEventCardProps) {
  return (
    <article
      data-status={status}
      data-animate="life-event"
      className="group relative isolate overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-subtle)] transition-colors duration-[var(--motion-base)] ease-[var(--motion-ease-subtle)]"
    >
      <div
        className={`absolute inset-x-4 top-0 h-1 rounded-full ${statusAccent[status]} opacity-80`}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="type-meta text-[color:var(--color-text-muted)]">Life event</p>
          <h2 className="text-xl font-semibold text-[color:var(--color-text)]">{title}</h2>
          <p className="type-body text-[color:var(--color-text-muted)]">{context}</p>
        </div>
        <span
          className={[
            "shrink-0 rounded-full border px-3 py-1 text-xs font-semibold",
            statusTone[status],
          ].join(" ")}
        >
          {statusLabel[status]}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={primaryAction.href}
          className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-muted)] px-4 py-2 text-sm font-semibold text-[color:var(--color-text)] transition-colors duration-[var(--motion-base)] ease-[var(--motion-ease-subtle)] hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-accent-calm)]"
        >
          {primaryAction.label}
        </Link>
        {secondaryAction ? (
          <Link
            href={secondaryAction.href}
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold text-[color:var(--color-text-muted)] transition-colors duration-[var(--motion-base)] ease-[var(--motion-ease-subtle)] hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-surface-muted)]"
          >
            {secondaryAction.label}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
