"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { books, chapters, reviews, reviewVotes, users } from "@/db/schema";
import {
  publicBookFields,
  publicReviewsFields,
  publicUserFields,
} from "@/db/selects";
import { BookParams } from "@/types";
import { and, desc, eq, inArray, sql } from "drizzle-orm";

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

export const deleteBookById = async (id: string) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const deleted = await db.delete(books).where(eq(books.id, id));

    if (!deleted) {
      throw new Error("Error");
    }

    return {
      succes: true,
    };
  } catch (e) {
    console.log(e);
    return {
      succes: false,
      message: "An error occurred while deleting the book",
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
      message: "An error occurred while feching the book",
    };
  }
};

export const getBookById = async (id: string) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const result = await db
      .select({
        ...publicBookFields,
        author: {
          ...publicUserFields,
        },
      })
      .from(books)
      .leftJoin(users, eq(books.authorId, users.id))
      .where(eq(books.id, id))
      .limit(1);

    const reviewsData = await db
      .select({
        ...publicReviewsFields,
        user: { ...publicUserFields },
        thumbsUp: sql<number>`COUNT(*) FILTER (WHERE ${reviewVotes.isLike} = true)`,
        thumbsDown: sql<number>`COUNT(*) FILTER (WHERE ${reviewVotes.isLike} = false)`,
        currentUserVote: sql<number | null>`
      MAX(CASE WHEN ${reviewVotes.userId} = ${session.user.id} 
               THEN ${reviewVotes.isLike}::int END)
    `,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .leftJoin(reviewVotes, eq(reviewVotes.reviewId, reviews.id))
      .where(eq(reviews.bookId, id))
      .groupBy(reviews.id, users.id);

    return {
      succes: true,
      data: result[0],
      reviews: reviewsData,
    };
  } catch (e) {
    console.error(e);
    return {
      succes: false,
      message: "An error occurred while fetching the book",
    };
  }
};

export const getBooksByIds = async (ids: string[]) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    if (ids.length <= 0) {
      throw new Error("No data parsed");
    }

    const result = await db
      .select(publicBookFields)
      .from(books)
      .where(inArray(books.id, ids));

    return {
      success: true,
      data: result,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "An error occurred while fetching the books",
    };
  }
};

export const getBookByGenre = async (genres: string[]) => {
  try {
    const genreArray = sql.raw(
      `ARRAY[${genres.map((g) => `'${g}'`).join(",")}]::genre[]`
    );

    const result = await db
      .select(publicBookFields)
      .from(books)
      .where(
        and(sql`${books.genre} && ${genreArray}`, eq(books.isPublic, true))
      );

    return { success: true, books: result };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: "Error fetching books by genre",
    };
  }
};

export const getMostViewedBooks = async (limit: number = 10) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const result = await db
      .select({
        ...publicBookFields,
        author: {
          ...publicUserFields,
        },
        totalViews: sql<number>`SUM(${chapters.visits})`,
      })
      .from(books)
      .leftJoin(chapters, eq(chapters.bookId, books.id))
      .innerJoin(users, eq(users.id, books.authorId))
      .where(eq(chapters.isPublic, true))
      .groupBy(books.id, users.id)
      .orderBy(desc(sql`COALESCE(SUM(${chapters.visits}), 0)`))
      .limit(limit);

    return {
      succes: true,
      data: result,
    };
  } catch (e) {
    console.error(e);
    return {
      succes: false,
      message: "An error occurred while fetching most viewed books",
    };
  }
};
