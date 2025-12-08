import { User } from "@/types/index";
import { DialogProps } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FormEvent, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, minimize } from "@/lib/utils";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FormType = {
  name: string;
  email: string;
  status: "PENDING" | "APROVED" | "BLOCKED";
  role: "AUTHOR" | "ADMIN" | "DEFAULT";
};

type Props = DialogProps & {
  selected: User;
  handleUpdateStatus: ({
    name,
    email,
    status,
    role,
  }: FormType) => Promise<boolean>;
};

const EditUserSheet = ({
  onOpenChange,
  selected,
  handleUpdateStatus,
  ...props
}: Props) => {
  const [processing, setProcessing] = useState(false);

  const form = useForm<FormType>({
    defaultValues: {
      name: selected.fullName,
      email: selected.email,
      status: selected.status,
      role: selected.role,
    },
  });

  const onSubmit = async (values: FormType) => {
    setProcessing(true);
    console.log(values);
    if (await handleUpdateStatus(values)) {
      onOpenChange?.(false);
    }
    setProcessing(false);
  };

  return (
    <Sheet onOpenChange={onOpenChange} {...props}>
      <SheetContent className="p-4 flex flex-col items-center w-full">
        <SheetHeader>
          <SheetTitle className="text-2xl flex flex-col">
            Update User
            <span className="text-sm text-slate-400">{selected.fullName}</span>
          </SheetTitle>
          <SheetDescription />
        </SheetHeader>

        <Avatar className="w-20 h-20 mt-5 text-xl">
          <AvatarFallback>
            {getInitials(selected.fullName || "IN")}
          </AvatarFallback>
        </Avatar>

        <Form {...form}>
          <form
            className="grid gap-4 py-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* EMAIL */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ROLE */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        {minimize(field.value)}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DEFAULT">Default</SelectItem>
                      <SelectItem value="AUTHOR">Author</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={processing}>
              {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {!processing ? "Update" : "Updating..."}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default EditUserSheet;
