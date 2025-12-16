import Link from "next/link";
import type { ReactNode } from "react";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/home" },
  { label: "Life Plans", href: "/life-plans" },
  { label: "Resources", href: "/resources" },
  { label: "Account", href: "/account" },
];

type AppShellProps = {
  children: ReactNode;
  activePath?: string;
  title?: string;
  description?: string;
};

export function AppShell({ children, activePath, title, description }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[color:var(--color-canvas)] text-[color:var(--color-text)]">
      <header className="sticky top-0 z-30 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/home" className="text-lg font-semibold tracking-tight">
              Fayvrz
            </Link>
            <span className="hidden h-6 w-px bg-[color:var(--color-border)] sm:block" />
            <p className="hidden text-sm text-[color:var(--color-text-muted)] sm:block">
              Calm plans for life events
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => {
              const isActive =
                activePath === item.href || activePath?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "rounded-full border px-3 py-2 text-sm font-semibold transition-colors",
                    "hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-surface-muted)]",
                    isActive
                      ? "border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text)]"
                      : "border-transparent bg-transparent text-[color:var(--color-text-muted)]",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        {(title || description) && (
          <section className="space-y-2">
            {title ? <h1 className="type-section">{title}</h1> : null}
            {description ? <p className="type-body max-w-3xl">{description}</p> : null}
          </section>
        )}
        {children}
      </main>
    </div>
  );
}
