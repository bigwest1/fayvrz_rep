import { LifeEventStatus, TaskStatus } from "@prisma/client";
import { prisma } from "./prisma";

export async function getPlanState(userId: string, lifeEventId: string) {
  const [lifeEventState, taskStates] = await Promise.all([
    prisma.lifeEventState.findUnique({
      where: { userId_lifeEventId: { userId, lifeEventId } },
    }),
    prisma.taskState.findMany({
      where: { userId, lifeEventId },
    }),
  ]);

  return { lifeEventState, taskStates };
}

export async function setLifeEventStatus(
  userId: string,
  lifeEventId: string,
  status: LifeEventStatus,
) {
  const existing = await prisma.lifeEventState.findUnique({
    where: { userId_lifeEventId: { userId, lifeEventId } },
  });

  const now = new Date();
  const startedAt =
    status === LifeEventStatus.ACTIVE
      ? existing?.startedAt ?? now
      : existing?.startedAt ?? null;
  const completedAt =
    status === LifeEventStatus.COMPLETED ? now : status === LifeEventStatus.ACTIVE ? null : existing?.completedAt ?? null;

  return prisma.lifeEventState.upsert({
    where: { userId_lifeEventId: { userId, lifeEventId } },
    create: {
      userId,
      lifeEventId,
      status,
      startedAt: startedAt ?? undefined,
      completedAt: completedAt ?? undefined,
    },
    update: {
      status,
      startedAt: startedAt ?? undefined,
      completedAt: completedAt ?? undefined,
    },
  });
}

export async function setTaskStatus(
  userId: string,
  lifeEventId: string,
  taskId: string,
  status: TaskStatus,
  notes?: string | null,
) {
  const now = new Date();
  return prisma.taskState.upsert({
    where: { userId_lifeEventId_taskId: { userId, lifeEventId, taskId } },
    create: {
      userId,
      lifeEventId,
      taskId,
      status,
      notes: notes || null,
    },
    update: {
      status,
      notes: notes || null,
      updatedAt: now,
    },
  });
}

export async function getAllLifeEventStates(userId: string) {
  return prisma.lifeEventState.findMany({
    where: { userId },
  });
}
