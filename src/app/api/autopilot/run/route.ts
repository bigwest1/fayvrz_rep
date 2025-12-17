import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/currentUser";
import { enforceUsageOrUpsell, consumeUsage } from "@/lib/billing/enforce";
import { allowedActions, runAutopilotAction, type AutopilotAction } from "@/lib/autopilot/actions";
import { rateLimit } from "@/lib/rateLimit";

const schema = z.object({
  action: z.string(),
  context: z.record(z.string(), z.any()).optional(),
});

export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid input", issues: parsed.error.format() }, { status: 400 });
  }
  const action: AutopilotAction = parsed.data.action as AutopilotAction;
  const context = parsed.data.context ?? {};

  if (!allowedActions.includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const rl = await rateLimit(user.id, "autopilot", 60_000, 20);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: "RateLimited" }, { status: 429 });
  }

  const enforcement = await enforceUsageOrUpsell(user.id, "AUTOPILOT_ACTIONS_PER_MONTH");
  if (!enforcement.ok) {
    return NextResponse.json(
      { ok: false, error: "LimitReached", upsell: enforcement.upsell, usage: enforcement.usage },
      { status: 402 },
    );
  }

  const result = runAutopilotAction(action, context);
  await consumeUsage(user.id, "AUTOPILOT_ACTIONS_PER_MONTH");
  return NextResponse.json({
    ok: true,
    action,
    note: "Assistive automation only. Verify details before sending. No medical or legal advice.",
    result,
  });
}
