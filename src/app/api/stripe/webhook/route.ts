import Stripe from "stripe";
import { purchases, books, authorsBalance } from "@/db/schema";
import { db } from "@/db/drizzle";
import { and, eq, sql } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;

    const userId = intent.metadata.userId;
    const bookId = intent.metadata.bookId;
    const amountPaid = intent.amount_received / 100;
    const currency = intent.currency.toUpperCase() as "EUR";

    try {
      await db.insert(purchases).values({
        userId,
        bookId,
        amountPaid: amountPaid.toString(),
        currency,
      });

      const [book] = await db
        .select({ authorId: books.authorId })
        .from(books)
        .where(eq(books.id, bookId));

      if (!book) throw new Error("Book not found");

      const [wallet] = await db
        .select()
        .from(authorsBalance)
        .where(
          and(
            eq(authorsBalance.authorId, book.authorId),
            eq(authorsBalance.currency, currency)
          )
        );

      if (wallet) {
        await db
          .update(authorsBalance)
          .set({
            balance: sql`${authorsBalance.balance} + ${amountPaid}`,
            updatedAt: new Date(),
          })
          .where(eq(authorsBalance.id, wallet.id));
      } else {
        await db.insert(authorsBalance).values({
          authorId: book.authorId,
          balance: amountPaid.toString(),
          currency,
        });
      }

      console.log("✅ Payment processed successfully");
      return new Response("ok", { status: 200 });
    } catch (err: any) {
      return new Response(`Error: ${err.message}`, { status: 500 });
    }
  }

  return new Response("ok", { status: 200 });
}