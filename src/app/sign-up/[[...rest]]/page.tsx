import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create account | Fayvrz",
  description: "Set up Fayvrz to keep life events and resources aligned.",
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--color-canvas)] px-4 py-12">
      <div className="w-full max-w-5xl rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-subtle)]">
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1.05fr_1fr] md:items-center">
          <div className="space-y-4">
            <p className="type-meta">New here</p>
            <h1 className="type-section">Create your space</h1>
            <p className="type-body max-w-xl text-[color:var(--color-text-muted)]">
              Save profile signals once, get plans that respect your context, and keep actions
              deliberate. No wizard steps — just a steady starting point.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-xs font-semibold text-[color:var(--color-text-muted)]">
              <span className="h-2 w-2 rounded-full bg-[color:var(--color-border-strong)]" />
              Server-first, calm defaults
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-[color:var(--color-text-muted)]">
              <Link href="/sign-in" className="underline-offset-4 hover:underline">
                Already have an account?
              </Link>
              <span aria-hidden>•</span>
              <Link href="/example" className="underline-offset-4 hover:underline">
                Preview a plan
              </Link>
            </div>
          </div>
          <div className="flex justify-end">
            <SignUp
              path="/sign-up"
              signInUrl="/sign-in"
              afterSignUpUrl="/home"
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
