import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { purchases } from "@/db/schema";
import config from "@/lib/config";
import { db } from "@/db/drizzle";

const stripe = new Stripe(config.env.stripe.stripeSecretKey);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      config.env.stripe.webhookSecret
    );
  } catch (err) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;

    const userId = intent.metadata.userId;
    const bookId = intent.metadata.bookId;

    if (!userId || !bookId) {
      return new NextResponse("Missing metadata", { status: 400 });
    }

    await db.insert(purchases).values({
      userId: userId,
      bookId: bookId,
      amountPaid: (intent.amount_received / 100).toString(),
      currency: intent.currency.toUpperCase(),
    });
  }

  return NextResponse.json({ received: true });
}
