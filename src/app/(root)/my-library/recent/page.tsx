"use client";

import BookCover from "@/components/BookCover";
import RecentBooksActions from "@/components/my-library/recent/RecentBooksActions";
import { RECENT_BOOKS_KEY } from "@/constants";
import { getBooksByIds } from "@/lib/actions/book";
import { Book } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
  const [recentBooksIDs, setRecentBooksIDs] = useState<string[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const getRecent = () => {
      const data = localStorage.getItem(RECENT_BOOKS_KEY);
      setRecentBooksIDs(JSON.parse(data || "[]"));

      console.log(data);
    };

    getRecent();
  }, []);

  useEffect(() => {
    const getData = async () => {
      if (recentBooksIDs.length <= 0) return;
      const res = await getBooksByIds(recentBooksIDs);
      if (res.success) {
        setBooks(res.data as unknown as Book[]);
      }
    };

    getData();
  }, [recentBooksIDs]);

  return (
    <div>
      {recentBooksIDs &&
      books &&
      books.length > 0 &&
      recentBooksIDs.length > 0 ? (
        <div className="mt-8 space-y-2">
          {books.map((b) => (
            <div
              className="hover:opacity-70 transition-all duration-300 flex items-center justify-between"
              key={b.id}
            >
              <Link
                href={`/books/${b.id}`}
                className="flex justify-between items-center w-full"
              >
                <div className="flex items-center gap-4 w-full">
                  <BookCover
                    coverUrl={b.cover !== "" ? b.cover : undefined}
                    coverColor={b.color}
                    className="w-26! min-w-26! h-34!"
                  />
                  <div className="">
                    <p className="font-bold text-xl truncate-1-lines">{b.title}</p>
                    <p className="text-slate-300 truncate-4-lines">{b.description}</p>
                  </div>
                </div>
              </Link>
              <RecentBooksActions
                id={b.id}
                setRecentBooksIDs={setRecentBooksIDs}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center mt-10">
          Nothing here yet.
        </div>
      )}
    </div>
  );
};

export default Page;
