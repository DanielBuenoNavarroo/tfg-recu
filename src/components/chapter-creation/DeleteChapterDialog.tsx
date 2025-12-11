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
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  chapterId: string;
  deleteC: (id: string) => void;
}

const DeleteChapterDialog = ({ chapterId, deleteC, open, setOpen }: Props) => {
  const [confirmText, setConfirmText] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async (id: string) => {
    setIsPending(true);
    deleteC(id);
    setOpen(false);
    setIsPending(false);
  };

  const WORD = "delete";

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-slate-900">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <span>
              If you delete this chapter, you will not be able to recover it.
            </span>
            <span className="flex flex-col py-4 gap-2">
              <span>
                If you are sure, enter <b>{WORD}</b> to confirm
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
            disabled={confirmText !== WORD || isPending}
            onClick={async () => {
              handleDelete(chapterId);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteChapterDialog;
