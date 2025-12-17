import { z } from "zod";
import type { LifeEventDefinition } from "./lifeEvent.schema";

const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  why: z.string().min(1),
  urgency: z.enum(["NOW", "NEXT", "LATER"]),
  howFayvrzHelps: z.string().min(1),
  fallback: z.string().min(1),
});

const outputSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["EMAIL", "CALL", "CHECKLIST", "NOTE"]),
  title: z.string().min(1),
  body: z.string().min(1),
});

const resourceSchema = z.object({
  id: z.string().min(1),
  intent: z.string().min(1),
  locationScoped: z.boolean(),
});

const automationSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["DRAFT", "REMINDER", "EXPORT"]),
  description: z.string().min(1),
  fallback: z.string().min(1),
});

export const lifeEventDefinitionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.enum(["HEALTH", "FINANCE", "FAMILY", "HOME", "CARE", "WORK", "OTHER"]),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  triggers: z.object({
    ageRange: z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]).optional(),
    keywords: z.array(z.string()).optional(),
    profileSignals: z.array(z.string()).optional(),
  }),
  tasks: z.array(taskSchema).min(1),
  outputs: z.array(outputSchema).min(1),
  resourceQueries: z.array(resourceSchema).optional().default([]),
  automations: z.array(automationSchema).optional().default([]),
  disclaimers: z.array(z.string()).optional(),
});

export function validateLifeEventDefinition(input: unknown): { ok: true; value: LifeEventDefinition } | { ok: false; error: string } {
  const parsed = lifeEventDefinitionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }
  return { ok: true, value: parsed.data };
}
