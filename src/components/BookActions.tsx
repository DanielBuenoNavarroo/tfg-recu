import { Dispatch, SetStateAction, useState } from "react";
import DeleteBookDialog from "./DeleteBookDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import TooltipWrapper from "./TooltipWrapper";
import UpdateBookDialog from "./UpdateBookDialog";
import { Book } from "@/types";

interface Props {
  book: Book;
  setOwnBooks: Dispatch<SetStateAction<Book[] | null>>;
}

const BookActions = ({ book, setOwnBooks }: Props) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DeleteBookDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        bookId={book.id}
        bookName={book.title}
        setOwnBooks={setOwnBooks}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <TooltipWrapper content={"More actions"}>
              <div className="flex items-center justify-center w-full h-full">
                <MoreVerticalIcon size={18} />
              </div>
            </TooltipWrapper>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <UpdateBookDialog selected={book} setOwnBooks={setOwnBooks} />
          <DropdownMenuItem
            className="text-destructive flex items-center gap-2"
            onSelect={() => setShowDeleteDialog((prev) => !prev)}
          >
            <TrashIcon className="stroke-red-400" size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default BookActions;
