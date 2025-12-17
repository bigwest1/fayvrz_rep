import { NextResponse } from "next/server";
import { JobStatus, JobType } from "@prisma/client";
import { runResourceSearch } from "@/lib/resources/engine";
import { claimNextJobs, completeJob, failJob } from "@/lib/jobs/queue";
import { prisma } from "@/lib/prisma";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_CALLS = 5;
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function checkRateLimit(key: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT_CALLS) return true;
  rateLimitMap.set(key, { count: entry.count + 1, windowStart: entry.windowStart });
  return false;
}

async function processJob(job: { id: string; userId: string | null; type: JobType; payloadJson: any }) {
  switch (job.type) {
    case JobType.GENERATE_RESOURCES_FOR_TASK: {
      const payload = job.payloadJson as {
        taskTemplateId?: string;
        queryKey: string;
        query: string;
        context?: Record<string, unknown>;
      };
      if (!job.userId || !payload?.taskTemplateId) {
        throw new Error("Missing userId or taskTemplateId");
      }
      await runResourceSearch({
        userId: job.userId,
        taskTemplateId: payload.taskTemplateId,
        queryKey: payload.queryKey,
        query: payload.query,
        context: payload.context ?? {},
      });
      break;
    }
    case JobType.GENERATE_SCRIPTS_FOR_TASK: {
      // Placeholder: scripts are rendered on demand; no-op for now
      break;
    }
    case JobType.SEND_NUDGE_EMAIL: {
      // Future: integrate Resend or mail provider. For now, store a log entry.
      await prisma.auditLog.create({
        data: {
          actorUserId: job.userId ?? "system",
          action: "NUDGE_EMAIL_STUB",
          targetType: "Job",
          targetId: job.id,
          metadataJson: job.payloadJson ?? {},
        },
      });
      break;
    }
    default:
      throw new Error(`Unhandled job type ${job.type}`);
  }
}

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") ?? req.headers.get("x-jobs-token");
  const expected = process.env.JOBS_ADMIN_TOKEN;
  if (!expected || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateKey = "jobs-process";
  if (checkRateLimit(rateKey)) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const jobs = await claimNextJobs(5);
  const results = [];
  for (const job of jobs) {
    try {
      await processJob(job as any);
      await completeJob(job.id);
      results.push({ id: job.id, status: JobStatus.DONE });
    } catch (error: any) {
      await failJob(job.id, error?.message ?? "unknown error");
      results.push({ id: job.id, status: JobStatus.FAILED, error: error?.message });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
