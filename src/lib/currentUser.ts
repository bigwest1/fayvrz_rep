import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import {
  defaultProfileSignals,
  sanitizeProfileSignals,
  type ProfileSignals,
} from "./profileSignals";
import { recordAudit } from "./audit";

function resolveDisplayName(user: any) {
  return (
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    user.primaryEmailAddress?.emailAddress ||
    "Member"
  );
}

function resolveEmail(user: any) {
  return user.primaryEmailAddress?.emailAddress || "unknown@example.com";
}

function resolveImageUrl(user: any) {
  return user.imageUrl || undefined;
}

function resolveRole(
  userId: string,
  currentRole: "USER" | "ADMIN" | "OWNER",
  email?: string | null,
) {
  const devAdmin = process.env.DEV_ADMIN_CLERK_USER_ID;
  const ownerClerk = process.env.OWNER_CLERK_USER_ID;
  const ownerEmail = process.env.OWNER_EMAIL;
  if (ownerClerk && ownerClerk === userId) {
    return "OWNER" as const;
  }
  if (ownerEmail && email && ownerEmail.toLowerCase() === email.toLowerCase()) {
    return "OWNER" as const;
  }
  if (process.env.NODE_ENV !== "production" && devAdmin && devAdmin === userId) {
    return "ADMIN" as const;
  }
  return currentRole;
}

export async function getClerkAuth() {
  const { userId } = await auth();
  return { userId };
}

async function getOrCreateUser() {
  const { userId } = await getClerkAuth();
  if (!userId) return null;

  const existing = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);
  const nextRole = resolveRole(userId, existing?.role ?? "USER", resolveEmail(clerkUser));

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

export async function getCurrentUser() {
  const { userId } = await getClerkAuth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  return user ?? (await getOrCreateUser());
}

export async function requireUser() {
  const user = await getOrCreateUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (user.isBanned || user.bannedAt) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function getProfileSignals(): Promise<ProfileSignals> {
  const user = await getCurrentUser();
  if (!user) {
    return defaultProfileSignals;
  }

  const profile = await prisma.profileSignals.findUnique({
    where: { userId: user.id },
  });

  const fallbackName =
    profile?.displayName ||
    user.displayName ||
    defaultProfileSignals.displayName;

  return sanitizeProfileSignals({
    ...defaultProfileSignals,
    ...(profile as any),
    displayName: fallbackName,
  });
}

export async function updateProfileSignals(signals: ProfileSignals) {
  "use server";
  const user = await requireUser();
  const cleaned = sanitizeProfileSignals(signals);

  await prisma.profileSignals.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      displayName: cleaned.displayName,
      ageBand: cleaned.ageBand,
      homeContext: cleaned.homeContext,
      location: cleaned.location,
      incomeBand: cleaned.incomeBand,
      preferences: cleaned.preferences ?? {},
    },
    update: {
      displayName: cleaned.displayName,
      ageBand: cleaned.ageBand,
      homeContext: cleaned.homeContext,
      location: cleaned.location,
      incomeBand: cleaned.incomeBand,
      preferences: cleaned.preferences ?? {},
    },
  });

  await recordAudit(
    "profile_signals_updated",
    {
      displayName: cleaned.displayName,
      ageBand: cleaned.ageBand,
      homeContext: cleaned.homeContext,
      location: cleaned.location,
      incomeBand: cleaned.incomeBand,
    },
    user.id,
  );

  return cleaned;
}
