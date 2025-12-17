type Step = {
  id: string;
  label: string;
  status: "now" | "next" | "later";
  onClick?: () => void;
};

type Props = {
  steps: Step[];
};

export function ProgressRail({ steps }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {steps.map((step) => (
        <button
          key={step.id}
          onClick={step.onClick}
          className="group flex items-start gap-3 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-left transition-colors hover:border-[color:var(--color-border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-border-strong)]"
        >
          <span
            className={[
              "mt-1 h-3 w-3 rounded-full",
              step.status === "now"
                ? "bg-[color:var(--color-text)]"
                : step.status === "next"
                  ? "bg-[color:var(--color-border-strong)]"
                  : "bg-[color:var(--color-border)]",
            ].join(" ")}
          />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[color:var(--color-text)]">{step.label}</p>
            <p className="text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">{step.status}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
