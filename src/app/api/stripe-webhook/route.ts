import Stripe from "stripe";
import { purchases } from "@/db/schema";
import { db } from "@/db/drizzle";

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
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;

    const userId = intent.metadata.userId;
    const bookId = intent.metadata.bookId;
    const amountPaid = intent.amount_received / 100;
    const currency = intent.currency.toUpperCase();

    await db.insert(purchases).values({
      userId,
      bookId,
      amountPaid: amountPaid.toString(),
      currency,
    });
  }

  return new Response("ok", { status: 200 });
}
