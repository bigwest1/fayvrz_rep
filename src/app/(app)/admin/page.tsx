import { AppShell } from "@/components/layout/AppShell";
import { getRecentAuditLogs } from "@/lib/audit";
import { requireDbUser } from "@/lib/auth.server";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const user = await requireDbUser();

  if (user.role !== "ADMIN") {
    return (
      <AppShell
        activePath="/admin"
        title="Admin"
        description="Role-based access only. Ask the team to enable admin access."
      >
        <section className="card space-y-3 p-5">
          <p className="type-body text-[color:var(--color-text-muted)]">
            Not authorized. This space is limited to admin roles.
          </p>
        </section>
      </AppShell>
    );
  }

  const [userCount, activePlans, recentLogs] = await Promise.all([
    prisma.user.count(),
    prisma.lifeEventState.count({ where: { status: "ACTIVE" } }),
    getRecentAuditLogs(10),
  ]);

  return (
    <AppShell
      activePath="/admin"
      title="Admin"
      description="Signals for system health and recent changes. Calm, read-only snapshot."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="card space-y-2 p-5">
          <p className="type-meta">Total users</p>
          <p className="text-3xl font-semibold text-[color:var(--color-text)]">{userCount}</p>
          <p className="type-body text-[color:var(--color-text-muted)]">
            Accounts synced from Clerk into the database.
          </p>
        </article>
        <article className="card space-y-2 p-5">
          <p className="type-meta">Active plans</p>
          <p className="text-3xl font-semibold text-[color:var(--color-text)]">{activePlans}</p>
          <p className="type-body text-[color:var(--color-text-muted)]">
            Life events currently marked active by members.
          </p>
        </article>
        <article className="card space-y-2 p-5">
          <p className="type-meta">Role</p>
          <p className="text-3xl font-semibold text-[color:var(--color-text)]">{user.role}</p>
          <p className="type-body text-[color:var(--color-text-muted)]">
            You have elevated access. Changes are audited.
          </p>
        </article>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="type-meta">Recent audit logs</p>
            <p className="type-body text-[color:var(--color-text-muted)]">
              Last 10 events across plans and profile updates.
            </p>
          </div>
        </div>
        <div className="grid gap-3">
          {recentLogs.map((log) => (
            <article key={log.id} className="card space-y-2 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-[color:var(--color-text)]">{log.eventType}</p>
                <span className="text-xs text-[color:var(--color-text-muted)]">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-[color:var(--color-text-muted)]">
                User: {log.user?.displayName ?? "Unknown"} ({log.userId ?? "n/a"})
              </p>
              {log.detailJson ? (
                <pre className="rounded-[var(--radius-md)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-xs text-[color:var(--color-text-muted)]">
                  {JSON.stringify(log.detailJson, null, 2)}
                </pre>
              ) : (
                <p className="text-xs text-[color:var(--color-text-muted)]">No details</p>
              )}
            </article>
          ))}
          {recentLogs.length === 0 ? (
            <article className="card p-4">
              <p className="type-body text-[color:var(--color-text-muted)]">
                No audit events recorded yet.
              </p>
            </article>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}
