"use client";

import { convertToSubcurrency } from "@/lib/convertToSubcurrency";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

const CheckOutPage = ({
  amount,
  bookId,
  userId,
}: {
  amount: number;
  bookId: string;
  userId: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrormessage] = useState<string>("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: convertToSubcurrency(amount),
        userId,
        bookId,
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount, bookId, userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrormessage(submitError.message ?? "");
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://localhost:3000/books/${bookId}/purchase-successfull`,
      },
    });

    if (error) {
      setErrormessage(error.message ?? "");
    } else {
      setLoading(false);
    }
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="absolute! m-px! h-px! w-px! overflow-hidden! whitespace-nowrap! border-0! p-0! [clip:rect(0,0,0,0)]!">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {clientSecret && <PaymentElement />}
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      <div className="w-full flex items-center">
        <Button
          className="w-full mx-auto max-w-40 mt-8 bg-light-200! text-black hover:text-black hover:bg-orange-200!"
          type="submit"
          disabled={!stripe || loading}
          variant={"outline"}
        >
          {!loading ? `Pay ${amount} €` : "Loading..."}
        </Button>
      </div>
    </form>
  );
};

export default CheckOutPage;
