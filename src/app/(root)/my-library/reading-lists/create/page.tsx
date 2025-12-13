"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createReadingList } from "@/lib/actions/reading-lists";
import { readingListSchema, readingListSchemaType } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Page = () => {
  const [processing, setProcessing] = useState(false);

  const form = useForm<readingListSchemaType>({
    resolver: zodResolver(readingListSchema),
    defaultValues: {
      description: "",
      name: "",
    },
  });

  const onSubmit = async (values: readingListSchemaType) => {
    setProcessing(true);
    const result = await createReadingList(values);

    if (result.success) {
      toast("Reading list created successfully");
      redirect("/my-library/reading-lists");
    } else {
      toast("Failed to create the reading list");
    }

    setProcessing(false);
  };
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <h1 className="font-bold text-xl">Create a reading list</h1>
      <div className="w-full mt-10 max-w-3xl">
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-1 items-center">
                    Collection name{" "}
                    <p className="text-xs text-rose-500">(required)</p>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>
                    Choose a descriptive and unique name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-1 items-center">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    {"Tell what's your list about."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={processing}>
              {!processing && "Create reading list."}
              {processing && <Loader2 className="animate-spin" />}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
