import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { authorRequests, users } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { status } = await req.json();

  const request = await db
    .update(authorRequests)
    .set({ status })
    .where(eq(authorRequests.id, id))
    .returning({ userId: authorRequests.userId });

  if (request.length === 0) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const userId = request[0].userId;

  if (status === "approved") {
    await db.update(users).set({ role: "AUTHOR" }).where(eq(users.id, userId));
  }

  return NextResponse.json({ success: true });
}
