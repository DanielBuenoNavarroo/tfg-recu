import { DialogProps } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { minimize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export type AddUserFormType = {
  name: string;
  email: string;
  password: string;
  status: "PENDING" | "APPROVED" | "BLOCKED";
  role: "AUTHOR" | "ADMIN" | "DEFAULT";
};

type Props = DialogProps & {
  handleAddUser: ({
    name,
    email,
    password,
    status,
    role,
  }: AddUserFormType) => Promise<boolean>;
};

const AddUserSheet = ({ onOpenChange, handleAddUser, ...props }: Props) => {
  const [processing, setProcessing] = useState(false);

  const form = useForm<AddUserFormType>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      status: "APPROVED",
      role: "DEFAULT",
    },
  });

  const onSubmit = async (values: AddUserFormType) => {
    setProcessing(true);
    console.log(values);
    if (await handleAddUser(values)) {
      onOpenChange?.(false);
    }
    setProcessing(false);
  };
  return (
    <Sheet onOpenChange={onOpenChange} {...props}>
      <SheetContent className="p-4 flex flex-col items-center w-full">
        <SheetHeader>
          <SheetTitle className="text-2xl flex flex-col">
            Create new user
          </SheetTitle>
          <SheetDescription />
        </SheetHeader>

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

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* STATUS */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
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
                      <SelectItem value="BLOCKED">Blocked</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                    </SelectContent>
                  </Select>
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
              {!processing ? "Add" : "Adding..."}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default AddUserSheet;
