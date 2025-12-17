import { AppShell } from "@/components/layout/AppShell";
import { recordAudit } from "@/lib/audit";
import { requireUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";

type AdminPageProps = {
  searchParams?: { q?: string; log?: string };
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const user = await requireUser();

  if (user.role !== "ADMIN" && user.role !== "OWNER") {
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

  const userQuery = searchParams?.q?.trim();
  const logQuery = searchParams?.log?.trim();

  const [userCount, activePlans, subscriptions, users, logs, jobs, lifeEvents, planCounts] =
    await Promise.all([
      prisma.user.count(),
      prisma.lifeEventState.count({ where: { status: "ACTIVE" } }),
      prisma.subscription.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
      prisma.user.findMany({
        where: userQuery
          ? {
              OR: [
                { email: { contains: userQuery, mode: "insensitive" } },
                { displayName: { contains: userQuery, mode: "insensitive" } },
              ],
            }
          : undefined,
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.auditLog.findMany({
        where: logQuery ? { action: { contains: logQuery, mode: "insensitive" } } : undefined,
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.job.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
      prisma.lifeEvent.findMany({ orderBy: { createdAt: "asc" }, include: { tasks: true } }),
      prisma.subscription.groupBy({ by: ["planId"], _count: { _all: true } }),
    ]);

  async function toggleBan(userId: string, banned: boolean) {
    "use server";
    await requireUser();
    await prisma.user.update({
      where: { id: userId },
      data: { isBanned: banned, bannedAt: banned ? new Date() : null },
    });
    await recordAudit(banned ? "ADMIN_BAN_USER" : "ADMIN_UNBAN_USER", { userId }, user.id, {
      type: "User",
      id: userId,
    });
  }

  async function createLifeEvent(formData: FormData) {
    "use server";
    const admin = await requireUser();
    if (admin.role !== "ADMIN" && admin.role !== "OWNER") return;
    const slug = (formData.get("slug") ?? "").toString().trim();
    const title = (formData.get("title") ?? "").toString().trim();
    const description = (formData.get("description") ?? "").toString().trim();
    if (!slug || !title) return;
    const event = await prisma.lifeEvent.upsert({
      where: { slug },
      update: { title, description },
      create: { slug, title, description },
    });
    await recordAudit("ADMIN_UPSERT_LIFE_EVENT", { slug, title }, admin.id, {
      type: "LifeEvent",
      id: event.id,
    });
  }

  async function createTaskTemplate(formData: FormData) {
    "use server";
    const admin = await requireUser();
    if (admin.role !== "ADMIN" && admin.role !== "OWNER") return;
    const lifeEventId = (formData.get("lifeEventId") ?? "").toString();
    const title = (formData.get("taskTitle") ?? "").toString();
    const purpose = (formData.get("taskPurpose") ?? "").toString();
    if (!lifeEventId || !title) return;
    const task = await prisma.taskTemplate.create({
      data: {
        lifeEventId,
        title,
        purpose: purpose || "Purposeful step",
      },
    });
    await recordAudit("ADMIN_CREATE_TASK_TEMPLATE", { lifeEventId, title }, admin.id, {
      type: "TaskTemplate",
      id: task.id,
    });
  }

  async function retryJob(formData: FormData) {
    "use server";
    const admin = await requireUser();
    const jobId = formData.get("jobId")?.toString();
    if (!jobId) return;
    await prisma.job.updateMany({ where: { id: jobId }, data: { status: "QUEUED", lastError: null } });
    await recordAudit("ADMIN_RETRY_JOB", { jobId }, admin.id, { type: "Job", id: jobId });
  }

  return (
    <AppShell
      activePath="/admin"
      title="Admin"
      description="Signals for system health and recent changes. Calm, direct controls."
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

      <section className="card space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="type-meta">Plan distribution</p>
            <p className="type-body text-[color:var(--color-text-muted)]">Snapshot of subscription mix.</p>
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          {planCounts.map((row) => (
            <div
              key={row.planId}
              className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2"
            >
              <p className="text-sm font-semibold text-[color:var(--color-text)]">{row.planId}</p>
              <p className="text-xs text-[color:var(--color-text-muted)]">{row._count._all} subscriptions</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="type-meta">Users</p>
            <p className="type-body text-[color:var(--color-text-muted)]">Search and ban/unban.</p>
          </div>
          <form className="flex gap-2" method="get">
            <input
              type="text"
              name="q"
              defaultValue={userQuery ?? ""}
              placeholder="Search users"
              className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm"
            />
            <button className="rounded-full border border-[color:var(--color-border)] px-3 py-2 text-sm font-semibold text-[color:var(--color-text)]">
              Search
            </button>
          </form>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2"
            >
              <p className="text-sm font-semibold text-[color:var(--color-text)]">{u.displayName}</p>
              <p className="text-xs text-[color:var(--color-text-muted)]">{u.email}</p>
              <p className="text-xs text-[color:var(--color-text-muted)]">Role: {u.role}</p>
              <form action={() => toggleBan(u.id, !u.isBanned)} className="mt-2">
                <button className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)] hover:border-[color:var(--color-border-strong)]">
                  {u.isBanned ? "Unban" : "Ban"}
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="card space-y-3 p-5">
        <p className="type-meta">Content</p>
        <p className="type-body text-[color:var(--color-text-muted)]">Manage life events and tasks.</p>
        <form action={createLifeEvent} className="grid gap-2 md:grid-cols-3">
          <input
            name="slug"
            placeholder="slug"
            className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm"
          />
          <input
            name="title"
            placeholder="Title"
            className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm"
          />
          <input
            name="description"
            placeholder="Description"
            className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm"
          />
          <button className="rounded-full border border-[color:var(--color-border)] px-3 py-2 text-sm font-semibold text-[color:var(--color-text)]">
            Save event
          </button>
        </form>
        <form action={createTaskTemplate} className="grid gap-2 md:grid-cols-4">
          <select
            name="lifeEventId"
            className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm"
          >
            {lifeEvents.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title}
              </option>
            ))}
          </select>
          <input
            name="taskTitle"
            placeholder="Task title"
            className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm"
          />
          <input
            name="taskPurpose"
            placeholder="Why this matters"
            className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm"
          />
          <button className="rounded-full border border-[color:var(--color-border)] px-3 py-2 text-sm font-semibold text-[color:var(--color-text)]">
            Add task
          </button>
        </form>
      </section>

      <section className="card space-y-3 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="type-meta">Jobs</p>
            <p className="type-body text-[color:var(--color-text-muted)]">Recent jobs with retry.</p>
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm"
            >
              <p className="font-semibold text-[color:var(--color-text)]">
                {job.type} · {job.status}
              </p>
              <p className="text-xs text-[color:var(--color-text-muted)]">Attempts: {job.attempts}</p>
              {job.status === "FAILED" ? (
                <form action={retryJob} className="mt-2">
                  <input type="hidden" name="jobId" value={job.id} />
                  <button className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)] hover:border-[color:var(--color-border-strong)]">
                    Retry
                  </button>
                </form>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="card space-y-3 p-5">
        <p className="type-meta">Subscriptions</p>
        <p className="type-body text-[color:var(--color-text-muted)]">Recent subscriptions summary.</p>
        <div className="grid gap-2 md:grid-cols-2">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2"
            >
              <p className="text-sm font-semibold text-[color:var(--color-text)]">
                {sub.planId} · {sub.status}
              </p>
              <p className="text-xs text-[color:var(--color-text-muted)]">User: {sub.userId}</p>
            </div>
          ))}
          {subscriptions.length === 0 ? (
            <p className="text-sm text-[color:var(--color-text-muted)]">No subscriptions yet.</p>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="type-meta">Audit logs</p>
            <p className="type-body text-[color:var(--color-text-muted)]">Searchable history of changes.</p>
          </div>
          <form className="flex gap-2" method="get">
            <input
              type="text"
              name="log"
              defaultValue={logQuery ?? ""}
              placeholder="Filter actions"
              className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm"
            />
            <button className="rounded-full border border-[color:var(--color-border)] px-3 py-2 text-sm font-semibold text-[color:var(--color-text)]">
              Filter
            </button>
          </form>
        </div>
        <div className="grid gap-3">
          {logs.map((log) => (
            <article key={log.id} className="card space-y-2 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-[color:var(--color-text)]">{log.action}</p>
                <span className="text-xs text-[color:var(--color-text-muted)]">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-[color:var(--color-text-muted)]">Actor: {log.actorUserId}</p>
              {log.metadataJson ? (
                <pre className="rounded-[var(--radius-md)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-xs text-[color:var(--color-text-muted)]">
                  {JSON.stringify(log.metadataJson, null, 2)}
                </pre>
              ) : (
                <p className="text-xs text-[color:var(--color-text-muted)]">No details</p>
              )}
            </article>
          ))}
          {logs.length === 0 ? (
            <article className="card p-4">
              <p className="type-body text-[color:var(--color-text-muted)]">No audit events recorded yet.</p>
            </article>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}
