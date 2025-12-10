"use client"

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createReview } from "@/lib/actions/reviews";
import { reviewSchema, reviewSchemaType } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ReviewForm = ({ id }: { id: string }) => {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<reviewSchemaType>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      description: "",
      rating: 1,
      title: "",
    },
  });

  const onSubmit = async (values: reviewSchemaType) => {
    setIsPending(true);
    const res = await createReview({ ...values, bookId: id });
    if (res.success) {
      toast.success("Review correctly added");
      redirect(`/books/${id}`);
    } else {
      toast.error("Error while revewing");
    }
    setIsPending(false);
  };

  return (
    <Form {...form}>
      <form
        className="bg-slate-950/50 w-full py-16 rounded-md mt-8 flex flex-col items-center border"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Rating */}
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center justify-center">
                <p className="text-xl">Overall</p>
              </FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={`cursor-pointer ${
                        star <= field.value
                          ? "fill-yellow-400 stroke-yellow-400"
                          : "stroke-gray-400"
                      }`}
                      onClick={() => field.onChange(star)}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="bg-slate-600 my-8" />

        <div className="px-4 w-full">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full max-w-2xl">
                <FormLabel className="flex gap-1 items-center text-xl">
                  Title <p className="text-xs text-rose-500">(required)</p>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full max-w-2xl mt-4">
                <FormLabel className="flex gap-1 items-center text-xl">
                  Description{" "}
                  <p className="text-xs text-rose-500">(required)</p>
                </FormLabel>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant={"outline"}
            className="w-full max-w-2xl mt-8"
            disabled={isPending}
          >
            {!isPending && "Proceed"}
            {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReviewForm;
