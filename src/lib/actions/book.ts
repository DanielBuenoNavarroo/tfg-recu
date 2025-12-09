"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { books } from "@/db/schema";
import { publicBookFields } from "@/db/selects";
import { BookParams } from "@/types";
import { eq } from "drizzle-orm";

export const createBook = async ({
  title,
  description,
  genre,
  coverColor,
  coverImage,
}: BookParams) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const newBook = await db
      .insert(books)
      .values({
        title,
        description,
        genre,
        coverColor,
        coverImage,
        authorId: session.user.id,
      })
      .returning();

    if (!newBook) {
      throw new Error("Error");
    }

    return {
      succes: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (e) {
    console.log(e);
    return {
      succes: false,
      message: "An error occurred while creating the book",
    };
  }
};

export const updateBook = async ({
  id,
  title,
  description,
  genre,
  coverColor,
  coverImage,
}: BookParams & { id: string }) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const updatedBook = await db
      .update(books)
      .set({
        title,
        description,
        genre,
        coverColor,
        coverImage,
        authorId: session.user.id,
      })
      .where(eq(books.id, id))
      .returning();

    if (!updatedBook) {
      throw new Error("Error");
    }

    return {
      succes: true,
      data: JSON.parse(JSON.stringify(updatedBook[0])),
    };
  } catch (e) {
    console.log(e);
    return {
      succes: false,
      message: "An error occurred while updating the book",
    };
  }
};

export const getBooksWithAuthorId = async (id: string) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const result = await db
      .select(publicBookFields)
      .from(books)
      .where(eq(books.authorId, id));

    return {
      succes: true,
      data: result,
    };
  } catch (e) {
    console.log(e);
    return {
      succes: false,
      message: "An error occurred while createng the book",
    };
  }
};
