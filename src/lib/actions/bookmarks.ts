"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { bookmarks, books } from "@/db/schema";
import { publicBookFields } from "@/db/selects";
import { eq, and } from "drizzle-orm";

export const addBookmark = async (bookId: string) => {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");

    await db.insert(bookmarks).values({
      userId: session.user.id,
      bookId,
    });

    return { success: true };
  } catch (e) {
    console.error("Error in addBookmark:", e);
    return {
      success: false,
      message: "An error occurred while adding bookmark",
    };
  }
};

export const removeBookmark = async (bookId: string) => {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");

    await db
      .delete(bookmarks)
      .where(
        and(eq(bookmarks.userId, session.user.id), eq(bookmarks.bookId, bookId))
      );

    return { success: true };
  } catch (e) {
    console.error("Error in removeBookmark:", e);
    return {
      success: false,
      message: "An error occurred while removing bookmark",
    };
  }
};

export const isBookBookmarked = async (bookId: string) => {
  try {
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
  } catch (e) {
    console.error("Error in isBookBookmarked:", e);
    return false;
  }
};

export const getBookmarksFromUser = async () => {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");

    const result = await db
      .select({
        ...publicBookFields,
      })
      .from(bookmarks)
      .innerJoin(books, eq(bookmarks.bookId, books.id))
      .where(eq(bookmarks.userId, session.user.id));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(result)),
    };
  } catch (e) {
    console.error("Error in getBookmarksFromUser:", e);
    return {
      success: false,
      message: "An error occurred while fetching bookmarks",
    };
  }
};
