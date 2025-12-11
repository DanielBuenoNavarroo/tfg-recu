"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { chapterGroups, chapters } from "@/db/schema";
import { publicChapterFields, publicChapterGroupFields } from "@/db/selects";
import { asc, eq, sql } from "drizzle-orm";

export const createChapter = async ({
  bookId,
  groupId,
  order,
  title,
}: {
  bookId: string;
  groupId?: string | null;
  order: number;
  title: string;
}) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const newChapter = await db
      .insert(chapters)
      .values({
        bookId,
        groupId: groupId ?? null,
        order,
        title,
        content: "",
      })
      .returning();

    if (!newChapter) {
      throw new Error("Error creating chapter");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newChapter[0])),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "An error occurred while creating the chapter",
    };
  }
};

export const updateChapter = async (
  id: string,
  data: Partial<{
    bookId: string;
    groupId: string | null;
    order: number;
    title: string;
    content: string;
    isPublic: boolean;
    publicDate?: Date;
    visits: number;
  }>
) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const normalizedData: typeof data & { lastUpdated: Date } = {
      ...data,
      lastUpdated: new Date(),
    };

    if (data.publicDate && data.isPublic) {
      normalizedData.publicDate = new Date(data.publicDate);
    }

    if (data.isPublic === false) {
      normalizedData.publicDate = undefined;
    }

    const updatedChapter = await db
      .update(chapters)
      .set(normalizedData)
      .where(eq(chapters.id, id))
      .returning();

    if (!updatedChapter) {
      throw new Error("Error updating chapter");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedChapter[0])),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "An error occurred while updating the chapter",
    };
  }
};

export const deleteChapter = async (id: string) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const deletedChapter = await db
      .delete(chapters)
      .where(eq(chapters.id, id))
      .returning();

    if (!deletedChapter) {
      throw new Error("Error deleting chapter");
    }

    const { bookId } = deletedChapter[0];

    const remaining = await db
      .select()
      .from(chapters)
      .where(eq(chapters.bookId, bookId))
      .orderBy(chapters.order, chapters.createdAt);

    for (let i = 0; i < remaining.length; i++) {
      await db
        .update(chapters)
        .set({ order: i + 1 })
        .where(eq(chapters.id, remaining[i].id));
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(deletedChapter[0])),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "An error occurred while deleting the chapter",
    };
  }
};

export const createChapterGroup = async ({
  bookId,
  name,
  order,
}: {
  bookId: string;
  name: string;
  order?: number;
}) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    let finalOrder = order;
    if (finalOrder === undefined) {
      const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(chapterGroups)
        .where(eq(chapterGroups.bookId, bookId));

      finalOrder = Number(result?.count ?? 0) + 1;
    }

    const newGroup = await db
      .insert(chapterGroups)
      .values({
        bookId,
        name,
        order: finalOrder,
      })
      .returning();

    if (!newGroup) {
      throw new Error("Error creating chapter group");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newGroup[0])),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "An error occurred while creating the chapter group",
    };
  }
};

export const updateChapterGroup = async (
  id: string,
  data: Partial<{
    name: string;
    order: number;
  }>
) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const updatedGroup = await db
      .update(chapterGroups)
      .set({
        ...data,
      })
      .where(eq(chapterGroups.id, id))
      .returning();

    if (!updatedGroup) {
      throw new Error("Error updating chapter group");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedGroup[0])),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "An error occurred while updating the chapter group",
    };
  }
};

export const deleteChapterGroup = async (id: string) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const deletedGroup = await db
      .delete(chapterGroups)
      .where(eq(chapterGroups.id, id))
      .returning();

    if (!deletedGroup) {
      throw new Error("Error deleting chapter group");
    }

    const bookId = deletedGroup[0].bookId;

    const remaining = await db
      .select()
      .from(chapterGroups)
      .where(eq(chapterGroups.bookId, bookId))
      .orderBy(chapterGroups.order);

    for (let i = 0; i < remaining.length; i++) {
      await db
        .update(chapterGroups)
        .set({ order: i + 1 })
        .where(eq(chapterGroups.id, remaining[i].id));
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(deletedGroup[0])),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "An error occurred while deleting the chapter group",
    };
  }
};

export async function getBookData(bookId: string) {
  try {
    if (!bookId) {
      throw new Error("Book ID is required");
    }

    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const groups = await db
      .select(publicChapterGroupFields)
      .from(chapterGroups)
      .where(eq(chapterGroups.bookId, bookId))
      .orderBy(asc(chapterGroups.order));

    const chaps = await db
      .select(publicChapterFields)
      .from(chapters)
      .where(eq(chapters.bookId, bookId))
      .orderBy(asc(chapters.order));

    return {
      success: true,
      data: {
        groups,
        chaps,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "An error occurred while fetching book data",
    };
  }
}

export async function getChapterById(chapterId: string) {
  try {
    if (!chapterId) {
      throw new Error("Chapter ID is required");
    }

    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const chapter = await db
      .select(publicChapterFields)
      .from(chapters)
      .where(eq(chapters.id, chapterId))
      .limit(1);

    if (!chapter || chapter.length === 0) {
      return {
        success: false,
        message: "Chapter not found",
      };
    }

    return {
      success: true,
      data: chapter[0],
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "An error occurred while fetching chapter data",
    };
  }
}
