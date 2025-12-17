import { JobStatus, JobType } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";

export async function enqueueJob(
  userId: string | null,
  type: JobType,
  payload: Record<string, unknown>,
  runAt: Date = new Date(),
) {
  return prisma.job.create({
    data: {
      userId: userId ?? undefined,
      type,
      payloadJson: payload as Prisma.InputJsonValue,
      status: JobStatus.QUEUED,
      runAt,
    },
  });
}

export async function claimNextJobs(limit = 5) {
  const now = new Date();
  const due = await prisma.job.findMany({
    where: { status: JobStatus.QUEUED, runAt: { lte: now } },
    orderBy: { runAt: "asc" },
    take: limit,
  });

  const claimed = [];
  for (const job of due) {
    const updated = await prisma.job.updateMany({
      where: { id: job.id, status: JobStatus.QUEUED },
      data: { status: JobStatus.RUNNING, attempts: job.attempts + 1 },
    });
    if (updated.count === 1) {
      claimed.push({ ...job, status: JobStatus.RUNNING, attempts: job.attempts + 1 });
    }
  }
  return claimed;
}

export function completeJob(id: string) {
  return prisma.job.update({
    where: { id },
    data: { status: JobStatus.DONE },
  });
}

export function failJob(id: string, error: string) {
  return prisma.job.update({
    where: { id },
    data: { status: JobStatus.FAILED, lastError: error },
  });
}
