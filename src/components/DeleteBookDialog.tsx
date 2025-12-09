"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Input } from "./ui/input";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  bookName: string;
  bookId: string;
}

const DeleteBookDialog = ({ bookId, bookName, open, setOpen }: Props) => {
  const [confirmText, setConfirmText] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleDelete = (id: string) => {};
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-slate-900">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <span>
              If you delete this book, you will not be able to recover it.
            </span>
            <span className="flex flex-col py-4 gap-2">
              <span>
                If you are sure, enter <b>{bookName}</b> to confirm
              </span>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={confirmText !== bookName || isPending}
            onClick={async () => {
              //   toast.loading("Deleting workflow...", { id: bookId });
              console.log("workflowId", bookId);
              handleDelete(bookId);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBookDialog;
