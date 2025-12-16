import { prisma } from "./prisma";

export async function recordAudit(eventType: string, detail: Record<string, unknown>, userId?: string) {
  try {
    await prisma.auditLog.create({
      data: {
        eventType,
        detailJson: detail,
        userId: userId ?? null,
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
    include: {
      user: true,
    },
  });
}
