"use client";

import { useEffect, useState } from "react";
import { getBookByGenre } from "@/lib/actions/book";
import { GENRE_ENUM } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { Book } from "@/types";
import { ChevronRight } from "lucide-react";
import NothingHereYet from "@/components/NothingHereYet";

const Page = () => {
  const [books, setBooks] = useState<Book[] | []>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("Action");
  useEffect(() => {
    const getBooks = async () => {
      const res = await getBookByGenre([selectedGenre]);
      if (res.success) {
        setBooks(res.books as unknown as Book[]);
      } else {
        setBooks([]);
      }
      console.log(res);
    };

    getBooks();
  }, [selectedGenre]);
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex overflow-x-auto">
        {GENRE_ENUM.enumValues.map((genre) => (
          <Button
            variant={"link"}
            key={genre}
            onClick={() => setSelectedGenre(genre)}
          >
            <p
              className={cn(
                "whitespace-nowrap uppercase font-semibold",
                selectedGenre === genre ? "text-blue-500" : ""
              )}
            >
              {genre}
            </p>
          </Button>
        ))}
      </div>
      <Separator />
      {books.length > 0 ? (
        <div className="mt-4">
          {books.map((book) => (
            <Link
              href={`/books/${book.id}`}
              key={book.id}
              className="flex items-center justify-between"
            >
              <div className="flex gap-4">
                <BookCover className="min-w-16! w-30 h-40" />
                <div className="">
                  <h2 className="font-bold text-2xl">{book.title}</h2>
                  <p className="text-slate-300">{book.description}</p>
                </div>
              </div>
              <ChevronRight />
            </Link>
          ))}
        </div>
      ) : (
        <NothingHereYet />
      )}
    </div>
  );
};

export default Page;
