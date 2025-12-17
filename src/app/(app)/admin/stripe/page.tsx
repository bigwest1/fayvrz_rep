import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { AppShell } from "@/components/layout/AppShell";
import { requireUser } from "@/lib/currentUser";
import { isStripeConfigured } from "@/lib/billing/stripe";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { getPlanByPriceId } from "@/lib/billing/plans";

export const runtime = "nodejs";

type Props = {
  searchParams?: { dry?: string };
};

export default async function AdminStripePage({ searchParams }: Props) {
  const admin = await requireUser();
  if (admin.role !== "OWNER") {
    redirect("/admin");
  }

  const logs = await prisma.auditLog.findMany({
    where: { action: { contains: "BILLING" } },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  const envStatus = {
    STRIPE_SECRET_KEY: Boolean(process.env.STRIPE_SECRET_KEY),
    STRIPE_WEBHOOK_SECRET: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    NEXT_PUBLIC_APP_URL: Boolean(process.env.NEXT_PUBLIC_APP_URL),
  };

  async function dryRun(formData: FormData) {
    "use server";
    const actor = await requireUser();
    if (actor.role !== "OWNER") return;
    const payload = formData.get("payload")?.toString();
    if (!payload) return;
    let parsed: any;
    try {
      parsed = JSON.parse(payload);
    } catch {
      await recordAudit("ADMIN_STRIPE_DRY_RUN", { error: "Invalid JSON" }, actor.id, { type: "Stripe", id: "invalid" });
      return;
    }

    const type = parsed.type ?? "unknown";
    const data = parsed.data?.object ?? {};
    let planId =
      data?.metadata?.planId ??
      getPlanByPriceId(data?.items?.data?.[0]?.price?.id)?.id ??
      "FREE";

    const would = {
      type,
      planId,
      status: data?.status ?? "n/a",
      stripeSubscriptionId: data?.id ?? data?.subscription,
    };

    await recordAudit("ADMIN_STRIPE_DRY_RUN", { type, planId }, actor.id, { type: "Stripe", id: would.stripeSubscriptionId ?? "n/a" });
    // For now we only log; surface result via audit log.
  }

  return (
    <AppShell activePath="/admin" title="Admin · Stripe" description="Verify billing readiness and dry-run payloads.">
      <section className="card space-y-3 p-5">
        <p className="type-meta">Env status</p>
        <div className="grid gap-2 md:grid-cols-2">
          {Object.entries(envStatus).map(([key, val]) => (
            <div key={key} className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm">
              <p className="font-semibold text-[color:var(--color-text)]">{key}</p>
              <p className="text-xs text-[color:var(--color-text-muted)]">{val ? "set" : "missing"}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-[color:var(--color-text-muted)]">
          Webhook endpoint: /api/billing/webhook · Stripe configured: {isStripeConfigured() ? "yes" : "no"}
        </p>
      </section>

      <section className="card space-y-3 p-5">
        <p className="type-meta">Dry run webhook parsing</p>
        <p className="text-sm text-[color:var(--color-text-muted)]">Paste a Stripe event JSON. No DB writes, just parse.</p>
        <form action={dryRun} className="space-y-2">
          <textarea
            name="payload"
            rows={6}
            className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm"
            placeholder='{"type":"checkout.session.completed","data":{"object":{...}}}'
          />
          <button className="rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-4 py-2 text-sm font-semibold text-[color:var(--color-surface)]">
            Dry run
          </button>
        </form>
      </section>

      <section className="card space-y-3 p-5">
        <p className="type-meta">Recent billing audit</p>
        <div className="grid gap-2">
          {logs.map((log) => (
            <div key={log.id} className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm">
              <p className="font-semibold text-[color:var(--color-text)]">{log.action}</p>
              <p className="text-xs text-[color:var(--color-text-muted)]">{new Date(log.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
