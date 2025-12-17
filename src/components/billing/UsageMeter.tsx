type Props = {
  label: string;
  used: number;
  limit: number | "unlimited";
};

export function UsageMeter({ label, used, limit }: Props) {
  const total = limit === "unlimited" ? Math.max(used, 1) : limit;
  const percent = limit === "unlimited" ? 0 : Math.min(100, Math.round((used / (total || 1)) * 100));
  const remaining = limit === "unlimited" ? "∞" : Math.max(total - used, 0);

  return (
    <div className="space-y-1 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3">
      <div className="flex items-center justify-between text-sm">
        <p className="font-semibold text-[color:var(--color-text)]">{label}</p>
        <span className="text-[color:var(--color-text-muted)]">
          {used}/{limit === "unlimited" ? "∞" : total}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[color:var(--color-surface-muted)]">
        <div
          className="h-full rounded-full bg-[color:var(--color-text)] transition-[width]"
          style={{ width: limit === "unlimited" ? "0%" : `${percent}%` }}
          aria-hidden
        />
      </div>
      <p className="text-xs text-[color:var(--color-text-muted)]">
        Remaining: {remaining}
      </p>
    </div>
  );
}
