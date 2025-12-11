"use client";

import CreateBookDialog from "@/components/CreateBookDialog";
import { getBooksWithAuthorId } from "@/lib/actions/book";
import { Book } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Book as BookType } from "@/types";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import BookActions from "@/components/BookActions";

const Page = () => {
  const { data: session } = useSession();
  const [ownBooks, setOwnBooks] = useState<BookType[] | null>(null);

  useEffect(() => {
    const getBooks = async () => {
      if (!session) return;
      const res = await getBooksWithAuthorId(session?.user.id);

      console.log(res);

      setOwnBooks(res.data as unknown as BookType[]);
    };

    getBooks();
  }, [session]);

  if (!ownBooks || ownBooks.length === 0) {
    return (
      <div className="flex flex-col gap-4 h-full items-center justify-center pt-10">
        <div className="flex flex-col text-center mb-16">
          <h1 className="text-3xl font-bold">Books</h1>
          <p className="text-slate-300">Manage your books</p>
        </div>
        <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
          <Book size={40} className="stroke-slate-300" />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No books created yet</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first book
          </p>
        </div>
        <CreateBookDialog setOwnBooks={setOwnBooks} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full pt-10">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Books</h1>
          <p className="text-slate-300">Manage your books</p>
        </div>
        <CreateBookDialog setOwnBooks={setOwnBooks} />
      </div>
      <div className="h-full py-8 flex gap-4 flex-wrap flex-row justify-around">
        {ownBooks.map((book) => (
          <div key={book.id} className="mt-4">
            <Link href={`/created/${book.id}`}>
              <BookCover coverColor={book.color} className="h-60!" />
            </Link>
            <div className="flex items-center justify-between mt-2">
              <h2 className="text-xl font-semibold truncate max-w-[133px]">{book.title}</h2>
              <BookActions book={book} setOwnBooks={setOwnBooks} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
