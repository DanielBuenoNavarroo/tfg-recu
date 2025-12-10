"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { reviews, reviewVotes } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";

type VoteInput = {
  reviewId: string;
  isLike: boolean;
};

type ReviewInput = {
  bookId: string;
  title: string;
  description: string;
  rating: number;
};

export async function voteReview({ isLike, reviewId }: VoteInput) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const userId = session.user.id;

  try {
    const existing = await db
      .select()
      .from(reviewVotes)
      .where(
        and(eq(reviewVotes.userId, userId), eq(reviewVotes.reviewId, reviewId))
      );

    if (existing.length === 0) {
      await db.insert(reviewVotes).values({
        userId,
        reviewId,
        isLike,
      });
      return { success: true, action: "inserted" };
    }

    const currentVote = existing[0];

    if (currentVote.isLike === isLike) {
      return { success: false, error: "Ya has votado esta reseña" };
    }

    await db
      .update(reviewVotes)
      .set({ isLike })
      .where(eq(reviewVotes.id, currentVote.id));

    return { success: true, action: "updated" };
  } catch (e) {
    console.log(e);
    return { success: false, message: "Error while voting" };
  }
}

export async function createReview({
  bookId,
  title,
  description,
  rating,
}: ReviewInput) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  if (rating < 0 || rating > 5) {
    return { success: false, error: "Rating must be between 0 and 5" };
  }

  try {
    const [newReview] = await db
      .insert(reviews)
      .values({
        userId: session.user.id,
        bookId,
        title,
        description,
        rating,
      })
      .returning();

    return { success: true, review: newReview };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Error inserting review" };
  }
}

export async function deleteReview(reviewId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  try {
    const existing = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, reviewId));

    if (existing.length === 0) {
      return { success: false, error: "Reseña no encontrada" };
    }

    if (
      existing[0].userId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return { success: false, error: "No autorizado" };
    }

    await db.delete(reviews).where(eq(reviews.id, reviewId));
    return { success: true, message: "Reseña eliminada correctamente" };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Error al eliminar la reseña" };
  }
}
