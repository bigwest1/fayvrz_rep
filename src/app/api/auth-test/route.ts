import { getClerkAuth } from "@/lib/auth.server";
import { getDbUser } from "@/lib/auth.server";

export async function GET() {
  const { userId: clerkUserId } = getClerkAuth();
  const dbUser = await getDbUser();

  return Response.json({
    authenticated: Boolean(clerkUserId),
    ...(clerkUserId ? { clerkUserId } : {}),
    ...(dbUser ? { dbUserId: dbUser.id } : {}),
  });
}
