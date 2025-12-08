import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { publicUserFields } from "@/db/selects";
import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new Response("Unauthorized", { status: 403 });
    }

    const allUsers = await db
      .select(publicUserFields)
      .from(users)
      .orderBy(asc(users.fullName));
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
