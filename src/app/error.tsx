'use client';

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--color-canvas)] px-6">
      <div className="w-full max-w-lg space-y-4 rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 text-[color:var(--color-text)] shadow-[var(--shadow-subtle)]">
        <p className="type-meta">Something slipped</p>
        <p className="type-body text-[color:var(--color-text-muted)]">
          We hit a snag. Your data is safe. Try again or head home.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => reset()}
            className="rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-4 py-2 text-sm font-semibold text-[color:var(--color-surface)]"
          >
            Try again
          </button>
          <a
            href="/home"
            className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold text-[color:var(--color-text)]"
          >
            Go home
          </a>
        </div>
        <p className="text-xs text-[color:var(--color-text-muted)]">{error.message}</p>
      </div>
    </main>
  );
}
