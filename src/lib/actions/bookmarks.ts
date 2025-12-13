"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { bookmarks } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const addBookmark = async (bookId: string) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await db.insert(bookmarks).values({
    userId: session.user.id,
    bookId,
  });

  return { success: true };
};

export const removeBookmark = async (bookId: string) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await db
    .delete(bookmarks)
    .where(
      and(eq(bookmarks.userId, session.user.id), eq(bookmarks.bookId, bookId))
    );

  return { success: true };
};

export const isBookBookmarked = async (bookId: string) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const result = await db
    .select({ id: bookmarks.id })
    .from(bookmarks)
    .where(
      and(eq(bookmarks.userId, session.user.id), eq(bookmarks.bookId, bookId))
    )
    .limit(1);

  return result.length > 0;
};
