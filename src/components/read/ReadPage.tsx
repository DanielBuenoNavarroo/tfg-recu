"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Book, User } from "@/types";
import { ChapterType } from "@/db/selects";
import { getBookById } from "@/lib/actions/book";
import { getChapterById } from "@/lib/actions/chapters";
import { ChevronLeft, Cog, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getInitials } from "@/lib/utils";

const ReadPage = ({
  bookId,
  chapterId,
}: {
  bookId: string;
  chapterId: string;
}) => {
  const [book, setBook] = useState<Book>();
  const [chapter, setChapter] = useState<ChapterType>();
  const [author, setAuthor] = useState<User>();

  useEffect(() => {
    const getData = async () => {
      const b = await getBookById(bookId);
      const c = await getChapterById(chapterId);

      if (b.succes) {
        setBook(b.data as unknown as Book);
        setAuthor(b.data?.author as unknown as User);
      }

      if (c.success) {
        setChapter(c.data as unknown as ChapterType);
      }
    };

    getData();
  }, [bookId, chapterId]);

  return (
    <div className="relative max-w-5xl mx-auto">
      <Button variant={"outline"} className="fixed right-10 bottom-10">
        <Cog size={20} />
      </Button>
      <div className="flex items-center justify-between">
        <Button asChild variant={"outline"} className="bg-slate-900!">
          <Link
            href={`/books/${bookId}/chapters`}
            className="flex items-center justify-center"
          >
            <ChevronLeft />
            {book?.title}
            <p className="mx-0.5 text-xl">·</p>
            <p>Chapter list</p>
          </Link>
        </Button>
        <div className="">Chapter list</div>
      </div>
      <h1 className="text-3xl font-bold mt-8">{chapter?.title}</h1>
      <div className="flex items-center mt-4">
        <Avatar className="size-10">
          <AvatarFallback>
            {author?.fullName ? (
              getInitials(author.fullName || "IN")
            ) : (
              <UserIcon />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="flex pl-3 text-sm flex-col">
          <p className="text-base">{author?.fullName}</p>
          <p className="text-slate-400">
            {chapter && chapter.publicDate
              ? new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(chapter.publicDate))
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadPage;
