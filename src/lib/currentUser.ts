import { prisma } from "./prisma";
import {
  defaultProfileSignals,
  sanitizeProfileSignals,
  type ProfileSignals,
} from "./profileSignals";
import { getDbUser, requireDbUser } from "./auth.server";
import { recordAudit } from "./audit";

export async function getCurrentUser() {
  return getDbUser();
}

export async function requireUser() {
  return requireDbUser();
}

export async function getProfileSignals(): Promise<ProfileSignals> {
  const user = await getDbUser();
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
    ...profile,
    displayName: fallbackName,
  });
}

export async function updateProfileSignals(signals: ProfileSignals) {
  "use server";
  const user = await requireDbUser();
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
