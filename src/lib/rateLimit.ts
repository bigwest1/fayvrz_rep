import { prisma } from "./prisma";

type LimitResult = { allowed: boolean; remaining?: number };

const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

function memLimit(bucket: string, windowMs: number, max: number): LimitResult {
  const now = Date.now();
  const entry = memoryBuckets.get(bucket);
  if (!entry || entry.resetAt < now) {
    memoryBuckets.set(bucket, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }
  if (entry.count >= max) {
    return { allowed: false, remaining: 0 };
  }
  entry.count += 1;
  return { allowed: true, remaining: max - entry.count };
}

function minuteStart(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes()));
}

export async function rateLimit(userId: string, key: string, windowMs = 60_000, max = 20): Promise<LimitResult> {
  const bucket = `${userId}:${key}`;
  if (process.env.NODE_ENV !== "production") {
    return memLimit(bucket, windowMs, max);
  }

  const now = new Date();
  const start = minuteStart(now);
  const end = new Date(start.getTime() + windowMs);
  const rlKey = `RATE_LIMIT:${key}`;

  try {
    const counter = await prisma.usageCounter.upsert({
      where: { userId_key_periodStart: { userId, key: rlKey, periodStart: start } },
      create: { userId, key: rlKey, periodStart: start, periodEnd: end, used: 1, limit: max },
      update: { used: { increment: 1 } },
    });
    return { allowed: counter.used <= max, remaining: Math.max(max - counter.used, 0) };
  } catch {
    // fallback to memory if DB hiccups
    return memLimit(bucket, windowMs, max);
  }
}
