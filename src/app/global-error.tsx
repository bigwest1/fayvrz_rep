'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="bg-[color:var(--color-canvas)] text-[color:var(--color-text)]">
        <main className="flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-lg space-y-4 rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]">
            <p className="type-meta">We’ll steady this</p>
            <p className="type-body text-[color:var(--color-text-muted)]">
              An unexpected error occurred. Nothing was saved. You can retry or head back home.
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
      </body>
    </html>
  );
}
