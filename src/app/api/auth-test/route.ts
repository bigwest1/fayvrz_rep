import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = auth();

  return Response.json({
    authenticated: Boolean(userId),
    ...(userId ? { userId } : {}),
  });
}
