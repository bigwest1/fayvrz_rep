type Item = {
  label: string;
  detail?: string;
};

type Props = {
  handles: Item[];
  youDo: Item[];
  options?: string[];
};

export function ConfidencePanel({ handles, youDo, options = [] }: Props) {
  return (
    <div className="grid gap-4 rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-subtle)] md:grid-cols-2">
      <div className="space-y-2">
        <p className="type-meta">Fayvrz handles</p>
        <ul className="space-y-1">
          {handles.map((item) => (
            <li key={item.label} className="flex items-start gap-2 text-sm text-[color:var(--color-text)]">
              <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--color-text)]" />
              <div>
                <p className="font-semibold">{item.label}</p>
                {item.detail ? (
                  <p className="text-[color:var(--color-text-muted)]">{item.detail}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        <p className="type-meta">You handle</p>
        <ul className="space-y-1">
          {youDo.map((item) => (
            <li key={item.label} className="flex items-start gap-2 text-sm text-[color:var(--color-text)]">
              <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--color-border-strong)]" />
              <div>
                <p className="font-semibold">{item.label}</p>
                {item.detail ? (
                  <p className="text-[color:var(--color-text-muted)]">{item.detail}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
        {options.length ? (
          <div className="pt-2">
            <p className="text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">Done-for-you options</p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs text-[color:var(--color-text)]">
              {options.map((opt) => (
                <span key={opt} className="rounded-full border border-[color:var(--color-border)] px-2 py-1">
                  {opt}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
