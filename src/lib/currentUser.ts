import { auth, clerkClient, currentUser as clerkCurrentUser } from "@clerk/nextjs/server";
import {
  defaultProfileSignals,
  type ProfileSignals,
  sanitizeProfileSignals,
} from "./profileSignals";

export async function getCurrentUser() {
  return clerkCurrentUser();
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function getProfileSignals(): Promise<ProfileSignals> {
  const user = await getCurrentUser();

  if (!user) {
    return defaultProfileSignals;
  }

  const storedSignals = (user.publicMetadata?.profileSignals ?? {}) as Partial<ProfileSignals>;
  const fallbackName =
    storedSignals.displayName ||
    user.fullName ||
    user.firstName ||
    user.username ||
    defaultProfileSignals.displayName;

  return sanitizeProfileSignals({
    ...defaultProfileSignals,
    ...storedSignals,
    displayName: fallbackName,
  });
}

export async function updateProfileSignals(signals: ProfileSignals) {
  "use server";
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const cleaned = sanitizeProfileSignals(signals);

  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      profileSignals: cleaned,
    },
  });

  return cleaned;
}
