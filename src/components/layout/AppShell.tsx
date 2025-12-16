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
      <header className="sticky top-0 z-30 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/home"
              className="rounded-[var(--radius-xs)] px-2 py-1 text-lg font-semibold tracking-tight transition-colors duration-[var(--motion-base)] ease-[var(--motion-ease-subtle)] hover:bg-[color:var(--color-surface-muted)]"
            >
              Fayvrz
            </Link>
            <span className="hidden h-6 w-px bg-[color:var(--color-border)] sm:block" aria-hidden />
            <p className="hidden text-sm text-[color:var(--color-text-muted)] sm:block">
              Plans that stay calm even when life does not
            </p>
          </div>
          <nav className="flex items-center gap-1 overflow-x-auto rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-1 py-1">
            {navItems.map((item) => {
              const isActive =
                activePath === item.href || activePath?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "group relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold whitespace-nowrap",
                    "transition-colors duration-[var(--motion-fast)] ease-[var(--motion-ease-standard)]",
                    isActive
                      ? "border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] text-[color:var(--color-text)] shadow-sm"
                      : "border border-transparent text-[color:var(--color-text-muted)] hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-surface)]",
                  ].join(" ")}
                >
                  {item.label}
                  <span
                    className={[
                      "pointer-events-none absolute inset-x-3 bottom-1 h-[2px] rounded-full",
                      "transition-all duration-[var(--motion-fast)] ease-[var(--motion-ease-standard)]",
                      isActive
                        ? "bg-[color:var(--color-text)] opacity-80"
                        : "bg-[color:var(--color-border-strong)] opacity-0 group-hover:opacity-40",
                    ].join(" ")}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-[var(--space-lg)] px-4 py-8 sm:px-6 sm:py-10">
        {(title || description) && (
          <section className="rounded-[calc(var(--radius-lg)+0.1rem)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-5 py-5 shadow-[var(--shadow-subtle)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                {title ? <h1 className="type-section">{title}</h1> : null}
                {description ? (
                  <p className="type-body max-w-3xl text-[color:var(--color-text-muted)]">
                    {description}
                  </p>
                ) : null}
              </div>
              <div className="hidden shrink-0 items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-xs font-semibold text-[color:var(--color-text-muted)] md:inline-flex">
                <span className="h-2 w-2 rounded-full bg-[color:var(--color-border-strong)]" />
                Steady pacing built in
              </div>
            </div>
          </section>
        )}
        <div className="flex flex-col gap-[var(--space-md)] pb-10">{children}</div>
      </main>
    </div>
  );
}
