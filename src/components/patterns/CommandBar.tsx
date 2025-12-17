"use client";

import { useEffect, useMemo, useState } from "react";

type Command = {
  label: string;
  action: () => void | Promise<void>;
};

type Props = {
  commands: Command[];
};

export function CommandBar({ commands }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)] hover:border-[color:var(--color-border-strong)]"
        aria-label="Open command bar"
      >
        ⌘K
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 py-10">
      <div className="w-full max-w-lg rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actions..."
            className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-border-strong)] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)] hover:border-[color:var(--color-border-strong)]"
          >
            Esc
          </button>
        </div>
        <div className="mt-3 max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-sm text-[color:var(--color-text-muted)]">No matches</p>
          ) : (
            <ul className="space-y-1">
              {filtered.map((cmd) => (
                <li key={cmd.label}>
                  <button
                    type="button"
                    onClick={() => {
                      cmd.action();
                      setOpen(false);
                    }}
                    className="w-full rounded-[var(--radius-md)] border border-transparent px-3 py-2 text-left text-sm text-[color:var(--color-text)] hover:border-[color:var(--color-border-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-text)]"
                  >
                    {cmd.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
