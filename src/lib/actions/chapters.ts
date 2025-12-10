"use server"

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { chapterGroups, chapters } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const createChapter = async ({
  bookId,
  groupId,
  order,
  title,
  content,
}: {
  bookId: string;
  groupId?: string | null;
  order: number;
  title: string;
  content: string;
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
        content,
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
    visits: number;
  }>
) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const updatedChapter = await db
      .update(chapters)
      .set({
        ...data,
        lastUpdated: new Date(),
      })
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

      finalOrder = (result?.count ?? 0) + 1;
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
