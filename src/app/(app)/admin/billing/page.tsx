import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { requireUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";

type Props = {
  searchParams?: { asUserId?: string };
};

export default async function AdminBillingPage({ searchParams }: Props) {
  const admin = await requireUser();
  if (admin.role !== "ADMIN" && admin.role !== "OWNER") {
    redirect("/admin");
  }

  let viewUserId = admin.id;
  if (searchParams?.asUserId && admin.role === "OWNER") {
    viewUserId = searchParams.asUserId;
    await recordAudit("ADMIN_IMPERSONATE_VIEW", { asUserId: viewUserId, page: "admin/billing" }, admin.id, {
      type: "AdminImpersonation",
      id: viewUserId,
    });
  }

  const [subscriptions, usageCounters, users] = await Promise.all([
    prisma.subscription.findMany({
      orderBy: { updatedAt: "desc" },
      include: { user: true },
      take: 30,
    }),
    prisma.usageCounter.findMany({
      orderBy: { updatedAt: "desc" },
      take: 50,
    }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
  ]);

  async function toggleBan(userId: string, banned: boolean) {
    "use server";
    const actor = await requireUser();
    if (actor.role !== "ADMIN" && actor.role !== "OWNER") return;
    await prisma.user.update({ where: { id: userId }, data: { isBanned: banned, bannedAt: banned ? new Date() : null } });
    await recordAudit(banned ? "ADMIN_BAN_USER" : "ADMIN_UNBAN_USER", { userId }, actor.id, { type: "User", id: userId });
  }

  async function resetUsage(userId: string) {
    "use server";
    const actor = await requireUser();
    if (actor.role !== "ADMIN" && actor.role !== "OWNER") return;
    await prisma.usageCounter.deleteMany({ where: { userId } });
    await recordAudit("ADMIN_RESET_USAGE", { userId }, actor.id, { type: "User", id: userId });
  }

  async function promoteAdmin(userId: string) {
    "use server";
    const actor = await requireUser();
    if (actor.role !== "OWNER") return;
    await prisma.user.update({ where: { id: userId }, data: { role: "ADMIN" } });
    await recordAudit("ADMIN_PROMOTE_ADMIN", { userId }, actor.id, { type: "User", id: userId });
  }

  return (
    <AppShell activePath="/admin" title="Admin · Billing" description="Subscription and usage signals with safe controls.">
      <section className="card space-y-3 p-5">
        <div className="flex items-center justify-between">
          <p className="type-meta">Impersonation</p>
          <p className="text-xs text-[color:var(--color-text-muted)]">Owner-only. Read-only view.</p>
        </div>
        {admin.role === "OWNER" ? (
          <form className="flex gap-2" method="get">
            <input
              type="text"
              name="asUserId"
              placeholder="User ID"
              defaultValue={searchParams?.asUserId ?? ""}
              className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm"
            />
            <button className="rounded-full border border-[color:var(--color-border)] px-3 py-2 text-sm font-semibold text-[color:var(--color-text)]">
              View
            </button>
          </form>
        ) : (
          <p className="text-sm text-[color:var(--color-text-muted)]">Only OWNER can impersonate.</p>
        )}
      </section>

      <section className="card space-y-3 p-5">
        <p className="type-meta">Subscriptions</p>
        <div className="grid gap-2 md:grid-cols-2">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm">
              <p className="font-semibold text-[color:var(--color-text)]">
                {sub.planId} · {sub.status}
              </p>
              <p className="text-xs text-[color:var(--color-text-muted)]">
                User: {sub.user?.displayName ?? sub.userId}
              </p>
              <p className="text-xs text-[color:var(--color-text-muted)]">
                Period end: {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : "n/a"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="card space-y-3 p-5">
        <p className="type-meta">Usage counters</p>
        <div className="grid gap-2 md:grid-cols-2">
          {usageCounters.map((u) => (
            <div key={u.id} className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm">
              <p className="font-semibold text-[color:var(--color-text)]">{u.key}</p>
              <p className="text-xs text-[color:var(--color-text-muted)]">
                User: {u.userId} · Used: {u.used}/{u.limit}
              </p>
              <p className="text-xs text-[color:var(--color-text-muted)]">
                Window: {new Date(u.periodStart).toLocaleString()}
              </p>
              <form action={() => resetUsage(u.userId)} className="pt-1">
                <button className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)]">
                  Reset usage
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="card space-y-3 p-5">
        <p className="type-meta">Users</p>
        <div className="grid gap-2 md:grid-cols-2">
          {users.map((u) => (
            <div key={u.id} className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm">
              <p className="font-semibold text-[color:var(--color-text)]">{u.displayName}</p>
              <p className="text-xs text-[color:var(--color-text-muted)]">Role: {u.role}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <form action={() => toggleBan(u.id, !u.isBanned)}>
                  <button className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)]">
                    {u.isBanned ? "Unban" : "Ban"}
                  </button>
                </form>
                {admin.role === "OWNER" ? (
                  <form action={() => promoteAdmin(u.id)}>
                    <button className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)]">
                      Promote to admin
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
