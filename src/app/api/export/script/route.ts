import { NextResponse } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { renderScript } from "@/lib/scripts/render";
import { requireUser } from "@/lib/currentUser";
import { enforceUsageOrUpsell, consumeUsage } from "@/lib/billing/enforce";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({
  scriptTemplateId: z.string().min(1),
  variables: z.record(z.any()).optional(),
});

export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid input", issues: parsed.error.format() }, { status: 400 });
  }
  const { scriptTemplateId, variables } = parsed.data;

  const rl = await rateLimit(user.id, "script-export", 60_000, 20);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: "RateLimited" }, { status: 429 });
  }

  const enforcement = await enforceUsageOrUpsell(user.id, "SCRIPT_EXPORTS_PER_MONTH");
  if (!enforcement.ok) {
    return NextResponse.json(
      { ok: false, error: "LimitReached", upsell: enforcement.upsell, usage: enforcement.usage },
      { status: 402 },
    );
  }

  const template = await prisma.scriptTemplate.findUnique({
    where: { id: scriptTemplateId },
  });

  if (!template) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const rendered = renderScript(template, variables ?? {});
  await consumeUsage(user.id, "SCRIPT_EXPORTS_PER_MONTH");
  return NextResponse.json({ ok: true, ...rendered });
}
