import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

type ClerkAuth = {
  userId: string | null;
};

export function getClerkAuth(): ClerkAuth {
  const { userId } = auth();
  return { userId };
}

function resolveDisplayName(user: Awaited<ReturnType<typeof clerkClient.users.getUser>>) {
  return (
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    user.primaryEmailAddress?.emailAddress ||
    "Member"
  );
}

function resolveEmail(user: Awaited<ReturnType<typeof clerkClient.users.getUser>>) {
  return user.primaryEmailAddress?.emailAddress || "unknown@example.com";
}

function resolveImageUrl(user: Awaited<ReturnType<typeof clerkClient.users.getUser>>) {
  return user.imageUrl || undefined;
}

function resolveRole(userId: string, currentRole: "USER" | "ADMIN") {
  const devAdmin = process.env.DEV_ADMIN_CLERK_USER_ID;
  if (process.env.NODE_ENV !== "production" && devAdmin && devAdmin === userId) {
    return "ADMIN" as const;
  }
  return currentRole;
}

export async function getOrCreateUser() {
  const { userId } = getClerkAuth();
  if (!userId) {
    return null;
  }

  const existing = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  const clerkUser = await clerkClient.users.getUser(userId);
  const nextRole = resolveRole(userId, existing?.role ?? "USER");

  const user = await prisma.user.upsert({
    where: { clerkUserId: userId },
    create: {
      clerkUserId: userId,
      email: resolveEmail(clerkUser),
      displayName: resolveDisplayName(clerkUser),
      imageUrl: resolveImageUrl(clerkUser),
      role: nextRole,
    },
    update: {
      email: resolveEmail(clerkUser),
      displayName: resolveDisplayName(clerkUser),
      imageUrl: resolveImageUrl(clerkUser),
      role: nextRole,
    },
  });

  return user;
}

export async function getDbUser() {
  const { userId } = getClerkAuth();
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  return user ?? (await getOrCreateUser());
}

export async function requireDbUser() {
  const user = await getOrCreateUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
