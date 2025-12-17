import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export async function recordAudit(
  action: string,
  detail: Record<string, unknown> = {},
  actorUserId?: string | null,
  target?: { type?: string; id?: string | null },
) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        actorUserId: actorUserId ?? "system",
        targetType: target?.type ?? "system",
        targetId: target?.id ?? null,
        metadataJson: detail as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to record audit event", error);
    }
  }
}

export async function getRecentAuditLogs(limit = 10) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
