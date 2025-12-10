"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { bookSchema, bookSchemaType } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import CustomDialogHeader from "./CustomDialogHeader";
import { BookA, Loader2 } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { GENRE_ENUM } from "@/db/schema";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import ColorPicker from "./ColorPicker";
import { createBook } from "@/lib/actions/book";
import { toast } from "sonner";
import { Book } from "@/types";

interface Props {
  triggerText?: string;
  setOwnBooks: Dispatch<SetStateAction<Book[] | null>>;
}

const CreateBookDialog = ({ triggerText, setOwnBooks }: Props) => {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<bookSchemaType>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      description: "",
      coverImage: "",
      coverColor: "#314158",
      genre: [],
    },
  });

  const coverImage = form.watch("coverImage");

  const onSubmit = async (values: bookSchemaType) => {
    setIsPending(true);
    const result = await createBook(values);

    if (result.succes) {
      toast("Book created successfully");
      setOwnBooks((prev) => [...(prev ?? []), result.data]);
      setOpen(false);
    } else {
      toast("Failed to create the book");
    }

    setIsPending(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          {triggerText ?? "Create Book"}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0 bg-slate-900 max-h-[700px] overflow-y-auto">
        <CustomDialogHeader
          icon={BookA}
          title="Create a new book"
          subtitle="Start writing your new book"
        />
        <Separator />
        <div className="p-6">
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Title <p className="text-xs text-rose-500">(required)</p>
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
                      Description{" "}
                      <p className="text-xs text-rose-500">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      {"Tell what's your book about."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Genres */}
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Genres <p className="text-xs text-rose-500">(required)</p>
                    </FormLabel>
                    <ScrollArea className="h-60 w-full rounded-sm border">
                      <div className="grid grid-cols-3 gap-2 m-2">
                        {GENRE_ENUM.enumValues.map((g) => (
                          <FormItem
                            key={g}
                            className="flex items-center space-x-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value.includes(g)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), g]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter((val) => val !== g)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{g}</FormLabel>
                          </FormItem>
                        ))}
                      </div>
                    </ScrollArea>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cover Image */}
              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Cover Image{" "}
                      <p className="text-xs text-slate-400">(optional)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="url" />
                    </FormControl>
                    <FormDescription>Put a cover to your book.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cover Color */}
              <FormField
                control={form.control}
                name="coverColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Cover Color{" "}
                      <p className="text-xs text-rose-500">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <ColorPicker
                        onPickerChange={field.onChange}
                        value={field.value}
                        url={coverImage.length <= 0 ? undefined : coverImage}
                      />
                    </FormControl>
                    <FormDescription>
                      Choose a color to your cover.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending && "Proceed"}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBookDialog;
