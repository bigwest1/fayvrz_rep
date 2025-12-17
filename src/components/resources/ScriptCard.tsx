"use client";

import { useState, useTransition } from "react";

type ScriptCardProps = {
  scriptTemplateId: string;
  channel: string;
  subject?: string | null;
  preview: string;
  variables?: Record<string, string>;
};

export function ScriptCard({ scriptTemplateId, channel, subject, preview, variables }: ScriptCardProps) {
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  async function handleCopy() {
    startTransition(async () => {
      const res = await fetch("/api/export/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scriptTemplateId, variables: variables ?? {} }),
      });
      if (!res.ok) return;
      const data = await res.json();
      await navigator.clipboard.writeText(data.text || data.markdown || preview);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 shadow-[var(--shadow-subtle)]">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1">
          <p className="type-meta">{channel}</p>
          {subject ? <p className="text-sm font-semibold text-[color:var(--color-text)]">{subject}</p> : null}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={pending}
          className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-3 py-1 text-xs font-semibold text-[color:var(--color-surface)] hover:opacity-90 disabled:opacity-60"
        >
          {copied ? "Copied" : "Copy script"}
        </button>
      </div>
      <p className="text-sm text-[color:var(--color-text-muted)] line-clamp-4">{preview}</p>
      <p className="text-xs text-[color:var(--color-text-muted)]">
        Scripts are suggestions. Review before sending.
      </p>
    </div>
  );
}
