import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { publicUserFields } from "@/db/selects";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new Response("Unauthorized", { status: 403 });
    }

    const user = await db
      .select(publicUserFields)
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new Response("Unauthorized", { status: 403 });
    }

    const { fullName, email, status, role } = body;

    if (!fullName && !email && !status && !role) {
      return NextResponse.json(
        { error: "No fields provided to update" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(users)
      .set({
        fullName: fullName,
        email: email,
        status: status,
        role: role,
      })
      .where(eq(users.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new Response("Unauthorized", { status: 403 });
    }

    const deleted = await db.delete(users).where(eq(users.id, id)).returning();

    if (!deleted) return new Response("Error deleting user", { status: 500 });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
