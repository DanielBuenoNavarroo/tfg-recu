"use client";

import TooltipWrapper from "@/components/TooltipWrapper";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Ellipsis, TrashIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  id: string;
  setRecentBooksIDs: Dispatch<SetStateAction<string[]>>;
}

const RecentBooksActions = ({ id, setRecentBooksIDs }: Props) => {
  const handleDelete = () => {
    try {
      const stored = localStorage.getItem("recent_books");
      const books: string[] = stored ? JSON.parse(stored) : [];

      const updated = books.filter((bookId) => bookId !== id);

      localStorage.setItem("recent_books", JSON.stringify(updated));

      setRecentBooksIDs(updated);
    } catch (err) {
      console.error("Error deleting book from recent_books:", err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
          <TooltipWrapper content={"More actions"}>
            <div className="flex items-center justify-center w-full h-full">
              <Ellipsis size={18} />
            </div>
          </TooltipWrapper>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive flex items-center gap-2"
          onClick={handleDelete}
        >
          <TrashIcon className="stroke-red-400" size={16} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RecentBooksActions;
