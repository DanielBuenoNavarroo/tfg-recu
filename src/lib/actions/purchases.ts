"use server";

import { purchases } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";

export const hasUserPurchasedBook = async (bookId: string) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const purchase = await db
      .select()
      .from(purchases)
      .where(
        and(eq(purchases.userId, session.user.id), eq(purchases.bookId, bookId))
      )
      .limit(1);

    if (!purchase || purchase.length === 0) {
      return {
        success: true,
        purchased: false,
      };
    }

    return {
      success: true,
      purchased: true,
      data: JSON.parse(JSON.stringify(purchase[0])),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "An error occurred while checking purchase",
    };
  }
};
