import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in | Fayvrz",
  description: "Sign in to keep your plans steady and your data in one place.",
};

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--color-canvas)] px-4 py-12">
      <div className="w-full max-w-5xl rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-subtle)]">
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1.05fr_1fr] md:items-center">
          <div className="space-y-4">
            <p className="type-meta">Welcome back</p>
            <h1 className="type-section">Sign in calmly</h1>
            <p className="type-body max-w-xl text-[color:var(--color-text-muted)]">
              Your life plans, signals, and resources stay organized here. No distractions, just
              access to the next clear step.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-xs font-semibold text-[color:var(--color-text-muted)]">
              <span className="h-2 w-2 rounded-full bg-[color:var(--color-border-strong)]" />
              Calm, server-first experience
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-[color:var(--color-text-muted)]">
              <Link href="/" className="underline-offset-4 hover:underline">
                Return to overview
              </Link>
              <span aria-hidden>•</span>
              <Link href="/example" className="underline-offset-4 hover:underline">
                View a sample plan
              </Link>
            </div>
          </div>
          <div className="flex justify-end">
            <SignIn
              path="/sign-in"
              signUpUrl="/sign-up"
              afterSignInUrl="/home"
              appearance={{
                elements: {
                  card: "w-full max-w-md border border-[color:var(--color-border)] shadow-[var(--shadow-subtle)] rounded-[var(--radius-lg)] p-0",
                },
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
