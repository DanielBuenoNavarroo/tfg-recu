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
        <div className="mt-4 space-y-4">
          {books.map((book) => (
            <Link
              href={`/books/${book.id}`}
              key={book.id}
              className="flex items-center justify-between"
            >
              <div className="flex gap-4 w-full">
                <BookCover
                  className="min-w-30! w-30 h-40"
                  coverColor={book.color}
                  coverUrl={book.cover.trim() !== "" ? book.cover : undefined}
                />
                <div className="flex flex-col w-full">
                  <h2 className="font-bold text-2xl truncate-1-lines">
                    {book.title}
                  </h2>
                  <p className="prose text-slate-300 truncate-4-lines line-clamp-4 w-fit overflow-x-hidden">
                    {book.description.replace(/\s+/g, " ").trim()}
                  </p>
                </div>
              </div>
              <div className="w-fit">
                <ChevronRight />
              </div>
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
