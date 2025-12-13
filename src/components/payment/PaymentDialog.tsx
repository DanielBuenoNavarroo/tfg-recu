"use client";

import config from "@/lib/config";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { convertToSubcurrency } from "@/lib/convertToSubcurrency";
import CheckOutPage from "./CheckOutPage";

if (config.env.stripe.stripePublicKey === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(config.env.stripe.stripePublicKey);

export const PaymentDialog = ({
  amount,
  userId,
  bookId,
}: {
  amount: number;
  userId: string;
  bookId: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full mt-2 bg-light-200">
          Buy for {amount}€
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[700px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(amount),
            currency: "eur",
          }}
        >
          <CheckOutPage amount={amount} userId={userId} bookId={bookId} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};
