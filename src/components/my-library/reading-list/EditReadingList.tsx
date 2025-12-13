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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { readingListSchema, readingListSchemaType } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateReadingList } from "@/lib/actions/reading-lists";

interface Props {
  id: string;
  initialName: string;
  initialDescription: string;
  setName: Dispatch<SetStateAction<string>>;
  setDesc: Dispatch<SetStateAction<string>>;
}

const EditReadingList = ({
  id,
  initialName,
  initialDescription,
  setName,
  setDesc,
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const form = useForm<readingListSchemaType>({
    resolver: zodResolver(readingListSchema),
    defaultValues: {
      name: initialName,
      description: initialDescription,
    },
  });

  const onSubmit = async (values: readingListSchemaType) => {
    setProcessing(true);
    const result = await updateReadingList(id, values);

    if (result.success) {
      toast("Reading list updated successfully");
      setName(values.name);
      setDesc(values.description ?? "");
    } else {
      toast("Failed to update the reading list");
    }

    setProcessing(false);
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          form.reset({
            name: initialName,
            description: initialDescription,
          });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit reading list</DialogTitle>
          <DialogDescription>
            Update the name and description of your list.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      {...field}
                      value={field.value ? field.value : ""}
                    />
                  </FormControl>
                  <FormDescription>
                    {"Tell what's your list about."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={processing}>
                {!processing && "Update list"}
                {processing && <Loader2 className="animate-spin" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditReadingList;
