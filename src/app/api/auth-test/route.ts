import { getClerkAuth, getCurrentUser } from "@/lib/currentUser";

export async function GET() {
  const { userId: clerkUserId } = await getClerkAuth();
  const dbUser = await getCurrentUser();

  return Response.json({
    authenticated: Boolean(clerkUserId),
    ...(clerkUserId ? { clerkUserId } : {}),
    ...(dbUser ? { dbUserId: dbUser.id } : {}),
  });
}
