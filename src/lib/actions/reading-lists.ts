"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { bookListItems, bookLists, books } from "@/db/schema";
import {
  PgError,
  publicBookFields,
  publicReadingListFields,
} from "@/db/selects";
import { readingListSchemaType } from "@/validations";
import { and, eq, sql } from "drizzle-orm";

export const createReadingList = async ({
  name,
  description,
}: {
  name: string;
  description?: string | null;
}) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const newList = await db
      .insert(bookLists)
      .values({
        userId: session.user.id,
        name,
        description: description ?? null,
      })
      .returning();

    if (!newList || newList.length === 0) {
      throw new Error("Error creating reading list");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newList[0])),
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "An error occurred while creating the reading list",
    };
  }
};

export const getReadingLists = async () => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const lists = await db
      .select({
        ...publicReadingListFields,
        bookCount: sql<number>`COUNT(${bookListItems.id})`,
      })
      .from(bookLists)
      .leftJoin(bookListItems, eq(bookLists.id, bookListItems.listId))
      .where(eq(bookLists.userId, session.user.id))
      .groupBy(
        bookLists.id,
        bookLists.userId,
        bookLists.name,
        bookLists.description,
        bookLists.createdAt
      )
      .orderBy(bookLists.createdAt);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(lists)),
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "An error occurred while fetching reading lists",
    };
  }
};

export const updateReadingList = async (
  id: string,
  values: readingListSchemaType
) => {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");

    await db
      .update(bookLists)
      .set({
        name: values.name,
        description: values.description,
      })
      .where(eq(bookLists.id, id));

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to update list" };
  }
};

export const createBookListItem = async ({
  listId,
  bookId,
}: {
  listId: string;
  bookId: string;
}) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const newItem = await db
      .insert(bookListItems)
      .values({
        listId,
        bookId,
      })
      .returning();

    if (!newItem || newItem.length === 0) {
      throw new Error("Error creating book list item");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newItem[0])),
    };
  } catch (e: unknown) {
    const err = e as PgError;
    if (err.code === "23505") {
      return {
        success: false,
        message: "This book is already in the list",
      };
    }
    console.error(err);
    return { success: false, message: "An error occurred" };
  }
};

export const getBooksInList = async (listId: string) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const itemsWithBooks = await db
      .select({
        id: bookListItems.id,
        addedAt: bookListItems.addedAt,
        book: {
          ...publicBookFields,
        },
        listName: bookLists.name,
        descritpion: bookLists.description,
      })
      .from(bookListItems)
      .innerJoin(books, eq(bookListItems.bookId, books.id))
      .innerJoin(bookLists, eq(bookListItems.listId, bookLists.id))
      .where(eq(bookListItems.listId, listId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(itemsWithBooks)),
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "An error occurred while fetching books in the list",
    };
  }
};

export const isBookInList = async (listId: string, bookId: string) => {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");

    const result = await db
      .select({ id: bookListItems.id })
      .from(bookListItems)
      .where(
        and(eq(bookListItems.listId, listId), eq(bookListItems.bookId, bookId))
      )
      .limit(1);

    return result.length > 0;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const deleteBookListItem = async (itemId: string) => {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");

    await db.delete(bookListItems).where(eq(bookListItems.id, itemId));

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete book list item" };
  }
};

export const deleteBookFromList = async (listId: string, bookId: string) => {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");

    await db
      .delete(bookListItems)
      .where(
        and(eq(bookListItems.listId, listId), eq(bookListItems.bookId, bookId))
      );

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete book from list" };
  }
};

export const deleteBookList = async (listId: string) => {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");

    await db.delete(bookLists).where(eq(bookLists.id, listId));

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete book list" };
  }
};
