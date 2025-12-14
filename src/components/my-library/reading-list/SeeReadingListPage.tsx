"use client";

import BookCover from "@/components/BookCover";
import { Button } from "@/components/ui/button";
import {
  deleteBookFromList,
  deleteBookList,
  getBooksInList,
} from "@/lib/actions/reading-lists";
import { Book } from "@/types";
import { Edit, Trash, X } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import EditReadingList from "./EditReadingList";

interface Props {
  id: string;
}

interface BookListItem {
  id: string;
  addedAt: string;
  listName: string;
  description: string;
  book: Book;
}

const SeeReadingListPage = ({ id }: Props) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const getData = async () => {
      const res = await getBooksInList(id);

      if (res.success) {
        const data = res.data as BookListItem[];

        setBooks(data.map((item) => item.book));

        if (data.length > 0) {
          setName(data[0].listName);
          setDesc(data[0].description);
        }

        console.log(res);
      }
    };

    getData();
  }, [id]);

  const deleteListItem = async (bookId: string) => {
    const res = await deleteBookFromList(id, bookId);

    if (res.success) toast.success("Book removed correctly");
    else toast.error("Failed to remove the book");
  };

  const deleteList = async () => {
    const res = await deleteBookList(id);

    if (res.success) {
      toast.success("List removed correctly");
      redirect("/my-library/reading-lists");
    } else toast.error("Failed to remove the list");
  };

  return (
    <div className="mt-10 w-full">
      <h1 className="text-xl font-bold text-center">{name}</h1>
      <p className="text-sm text-slate-300">{desc}</p>
      <div className="flex items-center justify-center mt-6 gap-4">
        <EditReadingList
          key={name + desc}
          id={id}
          initialDescription={desc}
          initialName={name}
          setName={setName}
          setDesc={setDesc}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost">
              <Trash />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete list</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{name}</strong>? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={deleteList}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-full mt-6">
        {books && books.length > 0 ? (
          books.map((b) => (
            <Link
              key={b.id}
              href={`/books/${b.id}`}
              className="relative border w-full rounded-md p-4 flex items-center bg-slate-950/40"
            >
              <div className="flex gap-4">
                <BookCover
                  coverUrl={b.cover !== "" ? b.cover : undefined}
                  coverColor={b.color}
                  className="w-26! min-w-26! h-34!"
                />
                <div className="">
                  <p className="text-xl font-bold truncate-1-lines">
                    {b.title}
                  </p>
                  <div className="flex gap-4 mt-2">
                    {b.genre.length > 0 &&
                      b.genre.map((g) => (
                        <p
                          key={g}
                          className="text-xs border rounded-full px-3 py-0.5 bg-slate-800"
                        >
                          {g}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
              <Button
                className="absolute right-6"
                variant={"ghost"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteListItem(b.id);
                }}
              >
                <X />
              </Button>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-10">
            <h1 className="text-xl font-bold text-center">{name}</h1>
            Nothing here yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default SeeReadingListPage;
