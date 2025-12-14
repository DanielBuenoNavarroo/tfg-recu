"use client";

import BookHero from "@/components/BookHero";
import BookList from "@/components/BookList";
import { Separator } from "@/components/ui/separator";
import { getMostViewedBooks } from "@/lib/actions/book";
import { Book, User } from "@/types";
import { useEffect, useState } from "react";

type BookWithViews = Book & {
  totalViews: number;
  author: User;
};

export default function Home() {
  const [trending, setTrending] = useState<BookWithViews[]>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const res = await getMostViewedBooks();

      if (res.succes) {
        setTrending(res.data as unknown as BookWithViews[]);
      } else {
        setError(true);
      }
    };

    getData();
  }, []);

  if (error) {
    return <>Failed to fetch the books</>;
  }

  return (
    <>
      {trending && !error && (
        <>
          <BookHero book={trending[0]} />
          <Separator className="mt-10" />
          <BookList
            title="Trending"
            books={trending}
            containerClassName="mt-10"
          />
        </>
      )}
    </>
  );
}
