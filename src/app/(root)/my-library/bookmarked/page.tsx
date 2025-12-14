"use client";

import BookCover from "@/components/BookCover";
import { Button } from "@/components/ui/button";
import { getBookmarksFromUser, removeBookmark } from "@/lib/actions/bookmarks";
import { Book } from "@/types";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [bookmarkedBooks, setBookmarkedBooks] = useState<Book[]>([]);

  useEffect(() => {
    const getData = async () => {
      const res = await getBookmarksFromUser();

      if (res.success) {
        setBookmarkedBooks(res.data);
      } else {
        console.log("Fail");
      }
    };

    getData();
  }, []);

  const handleBookmark = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const res = await removeBookmark(id);

    if (res.success) {
      toast.success("Bookmark removed correctly");

      setBookmarkedBooks((prev) => prev.filter((book) => book.id !== id));
    } else toast.error("Failed to remove the bookmark");
  };

  return (
    <div>
      {bookmarkedBooks && bookmarkedBooks.length > 0 ? (
        <div className="mt-8 space-y-2">
          {bookmarkedBooks.map((b) => (
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
                    <p className="font-bold text-xl truncate-1-lines">
                      {b.title}
                    </p>
                    <p className="text-slate-300 truncate-4-lines">
                      {b.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant={"outline"}
                  onClick={(e) => handleBookmark(e, b.id)}
                >
                  <Bookmark />
                </Button>
              </Link>
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
