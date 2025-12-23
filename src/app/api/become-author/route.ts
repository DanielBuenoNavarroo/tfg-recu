import { NextResponse } from "next/server";
import { authorRequests, users } from "@/db/schema";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authoriced" }, { status: 401 });
    }
    const result = await db
      .select({
        id: authorRequests.id,
        reason: authorRequests.reason,
        status: authorRequests.status,
        createdAt: authorRequests.createdAt,
        userName: users.fullName,
      })
      .from(authorRequests)
      .leftJoin(users, eq(authorRequests.userId, users.id));

    return NextResponse.json({ success: true, data: result });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, message: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { reason } = await req.json();

    await db.insert(authorRequests).values({
      userId: session.user.id,
      reason,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}
