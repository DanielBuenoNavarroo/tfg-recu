"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReadingListType } from "@/db/selects";
import { isBookInList } from "@/lib/actions/reading-lists";
import { Plus, Check, List } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  bookLists: ReadingListType[];
  bookId: string;
  onSelectList: (id: string) => void;
};

export const BookListSelector = ({
  bookLists,
  onSelectList,
  bookId,
}: Props) => {
  const [listsWithStatus, setListsWithStatus] = useState<
    { id: string; name: string; alreadyInList: boolean }[]
  >([]);

  useEffect(() => {
    const checkLists = async () => {
      const results = await Promise.all(
        bookLists.map(async (list) => {
          const alreadyInList = await isBookInList(list.id, bookId);
          return { ...list, alreadyInList };
        })
      );
      setListsWithStatus(results);
    };
    checkLists();
  }, [bookLists, bookId]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="border-2 border-slate-400 w-1/2 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {listsWithStatus.length > 0 ? (
          listsWithStatus.map((list) => (
            <DropdownMenuItem
              key={list.id}
              onClick={() => {
                if (list.alreadyInList) return;

                onSelectList(list.id);

                setListsWithStatus((prev) =>
                  prev.map((l) =>
                    l.id === list.id ? { ...l, alreadyInList: true } : l
                  )
                );
              }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-slate-500" />
                <p className="text-ellipsis">{list.name}</p>
              </div>
              {list.alreadyInList && (
                <Check className="w-4 h-4 text-green-500" />
              )}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No lists yet</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            className="flex items-center gap-2 font-medium"
            href={"/my-library/reading-lists/create"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Plus className="w-4 h-4" />
            Create new list
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BookListSelector;
