"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { comments, users } from "@/db/schema";
import { publicCommentFields } from "@/db/selects";
import { CommentNode } from "@/types";
import { and, eq } from "drizzle-orm";

type CreateCommentInput = {
  content: string;
  bookId?: string;
  chapterId?: string;
  parentCommentId?: string;
};

export async function createComment(input: CreateCommentInput) {
  try {
    const { content, bookId, chapterId, parentCommentId } = input;

    if (!content?.trim()) {
      throw new Error("Content is required");
    }

    if (!bookId && !chapterId) {
      throw new Error("Book ID or Chapter ID is required");
    }

    if (bookId && chapterId) {
      throw new Error("Comment can only belong to a book or a chapter");
    }

    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    let finalBookId = bookId ?? null;
    let finalChapterId = chapterId ?? null;

    if (parentCommentId) {
      const parent = await db
        .select({
          id: comments.id,
          bookId: comments.bookId,
          chapterId: comments.chapterId,
        })
        .from(comments)
        .where(eq(comments.id, parentCommentId))
        .limit(1);

      if (!parent || parent.length === 0) {
        return {
          success: false,
          message: "Parent comment not found",
        };
      }

      const parentComment = parent[0];

      if (
        (parentComment.bookId && parentComment.bookId !== finalBookId) ||
        (parentComment.chapterId && parentComment.chapterId !== finalChapterId)
      ) {
        return {
          success: false,
          message: "Parent comment belongs to a different book or chapter",
        };
      }

      finalBookId = parentComment.bookId;
      finalChapterId = parentComment.chapterId;
    }

    const inserted = await db
      .insert(comments)
      .values({
        content,
        userId: session.user.id,
        bookId: finalBookId,
        chapterId: finalChapterId,
        parentCommentId: parentCommentId ?? null,
      })
      .returning();

    const [comment] = await db
      .select({
        id: comments.id,
        content: comments.content,
        parentCommentId: comments.parentCommentId,
        createdAt: comments.createdAt,
        userId: comments.userId,
        userName: users.fullName,
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.id, inserted[0].id));

    if (!comment) {
      return {
        success: false,
        message: "Parent comment belongs to a different book or chapter",
      };
    }

    return {
      success: true,
      data: comment
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "An error occurred while creating comment",
    };
  }
}

export async function deleteComment(commentId: string) {
  try {
    if (!commentId) {
      throw new Error("Comment ID is required");
    }

    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const deleted = await db
      .delete(comments)
      .where(
        and(eq(comments.id, commentId), eq(comments.userId, session.user.id))
      )
      .returning();

    if (!deleted || deleted.length === 0) {
      return {
        success: false,
        message: "Comment not found or not authorized",
      };
    }

    return {
      success: true,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "An error occurred while deleting comment",
    };
  }
}

export async function getCommentsByChapterId(chapterId: string) {
  try {
    if (!chapterId) {
      throw new Error("Chapter ID is required");
    }

    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const result = await db
      .select(publicCommentFields)
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.chapterId, chapterId))
      .orderBy(comments.createdAt);

    return {
      success: true,
      data: result,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "An error occurred while fetching comments",
    };
  }
}
