import { Prisma, UserTaskStatus } from "@prisma/client";
import { prisma } from "./prisma";
import { getEntitlements } from "./billing/entitlements";
import { enforceEntitlementOrUpsell } from "./billing/enforce";

export async function getLifeEventBySlug(slug: string) {
  return prisma.lifeEvent.findUnique({
    where: { slug },
    include: {
      tasks: {
        include: {
          resources: true,
          scripts: true,
        },
      },
    },
  });
}

export async function ensureUserEvent(slug: string, userId: string) {
  const lifeEvent = await prisma.lifeEvent.findUnique({ where: { slug } });
  if (!lifeEvent) return null;

  const ent = await getEntitlements(userId);
  const activeCount = await prisma.userEvent.count({ where: { userId } });
  if (activeCount >= ent.MAX_ACTIVE_EVENTS) {
    return null;
  }

  const userEvent = await prisma.userEvent.upsert({
    where: { userId_lifeEventId: { userId, lifeEventId: lifeEvent.id } },
    update: {},
    create: {
      userId,
      lifeEventId: lifeEvent.id,
      status: "ACTIVE",
    },
  });

  // create user tasks if they don't exist
  const tasks = await prisma.taskTemplate.findMany({
    where: { lifeEventId: lifeEvent.id },
  });

  const existingUserTasks = await prisma.userTask.findMany({
    where: { userEventId: userEvent.id },
  });
  const existingTitles = new Set(existingUserTasks.map((t) => t.title));

  for (const task of tasks) {
    if (!existingTitles.has(task.title)) {
      await prisma.userTask.create({
        data: {
          userEventId: userEvent.id,
          title: task.title,
          status: UserTaskStatus.TODO,
        },
      });
    }
  }

  return userEvent;
}

export async function getUserEventsWithTasks(userId: string) {
  return prisma.userEvent.findMany({
    where: { userId },
    include: {
      lifeEvent: true,
      userTasks: true,
    },
  });
}

export async function getUserTasksByStatus(userId: string, status: UserTaskStatus) {
  return prisma.userTask.findMany({
    where: {
      userEvent: { userId },
      status,
    },
    include: {
      userEvent: {
        include: {
          lifeEvent: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function updateUserTaskStatus(id: string, status: UserTaskStatus, userId?: string) {
  if (userId) {
    const task = await prisma.userTask.findFirst({
      where: { id, userEvent: { userId } },
    });
    if (!task) {
      throw new Error("Unauthorized");
    }
  }
  return prisma.userTask.update({
    where: { id },
    data: { status },
  });
}

export async function getResourcesForTask(taskTemplateId: string, userId: string) {
  const [templates, cached] = await Promise.all([
    prisma.resourceTemplate.findMany({
      where: { taskTemplateId },
    }),
    prisma.localResource.findMany({
      where: { taskTemplateId, userId },
    }),
  ]);
  return { templates, cached };
}

export async function getScriptsForTask(taskTemplateId: string) {
  return prisma.scriptTemplate.findMany({
    where: { taskTemplateId },
  });
}

export async function getUserTasksForEvent(userEventId: string) {
  return prisma.userTask.findMany({
    where: { userEventId },
    orderBy: { createdAt: "asc" },
  });
}
