"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { authorsBalance } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

type WalletParams = {
  currency?: string;
  balance?: string;
  authorId?: string;
};

export const createWallet = async ({
  currency = "EUR",
  balance = "0",
  authorId,
}: WalletParams) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    let finalAuthor;

    if (!authorId) {
      finalAuthor = session.user.id;
    } else {
      finalAuthor = authorId;
    }

    const newWallet = await db
      .insert(authorsBalance)
      .values({
        authorId: finalAuthor,
        balance: balance,
        currency,
      })
      .returning();

    if (!newWallet || newWallet.length === 0) {
      throw new Error("Error creating wallet");
    }

    return {
      succes: true,
      data: JSON.parse(JSON.stringify(newWallet[0])),
    };
  } catch (e) {
    console.error(e);
    return {
      succes: false,
      message: "An error occurred while creating the wallet",
    };
  }
};

type getOrCreateWallet = {
  authorId: string;
  currency?: string;
  amount?: string;
};

export const createOrUpdateWallet = async ({
  authorId,
  currency = "EUR",
  amount = "0",
}: getOrCreateWallet) => {
  try {
    const [wallet] = await db
      .select()
      .from(authorsBalance)
      .where(
        and(
          eq(authorsBalance.authorId, authorId),
          eq(authorsBalance.currency, currency)
        )
      );

    if (wallet) {
      const [updatedWallet] = await db
        .update(authorsBalance)
        .set({
          balance: sql`${authorsBalance.balance} + ${amount}`,
          updatedAt: new Date(),
        })
        .where(eq(authorsBalance.id, wallet.id))
        .returning();

      return {
        success: true,
        data: updatedWallet,
        created: false,
        updated: true,
      };
    }

    // Crear nueva wallet si no existe
    const [newWallet] = await db
      .insert(authorsBalance)
      .values({
        authorId,
        balance: amount,
        currency,
      })
      .returning();

    return {
      success: true,
      data: newWallet,
      created: true,
      updated: false,
    };
  } catch (e) {
    console.error("Error in createOrUpdateWallet:", e);
    return {
      success: false,
      message: "An error occurred while creating or updating the wallet",
    };
  }
};
