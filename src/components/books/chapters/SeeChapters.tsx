"use client";

import NothingHereYet from "@/components/NothingHereYet";
import { ChapterGroupType, ChapterType } from "@/db/selects";
import { getBookById } from "@/lib/actions/book";
import { getBookData } from "@/lib/actions/chapters";
import { Book } from "@/types";
import { ChevronLeft, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import ChaptersGroupDisplay from "./ChaptersGroupDisplay";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  id: string;
}

const SeeChapters = ({ id }: Props) => {
  const [chapters, setChapters] = useState<ChapterType[]>([]);
  const [chaptersGroup, setChaptersGroup] = useState<ChapterGroupType[]>([]);
  const [book, setBook] = useState<Book>();

  useEffect(() => {
    const getData = async () => {
      const res = await getBookData(id);

      if (res.success) {
        setChapters(res.data?.chaps as unknown as ChapterType[]);
        setChaptersGroup(res.data?.groups as unknown as ChapterGroupType[]);
      }

      const b = await getBookById(id);

      if (b.succes) {
        setBook(b.data as unknown as Book);
      }
    };

    getData();
  }, [id]);
  return (
    <div className="max-w-7xl mx-auto w-full p-4">
      <div className="flex justify-between items-center">
        <Button variant={"outline"} className="bg-slate-900!" asChild>
          <Link
            href={`/books/${id}`}
            className="flex items-center justify-center px-4!"
          >
            <ChevronLeft />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-extrabold">{book?.title}</h1>
      </div>
      <div className="mt-8">
        {chaptersGroup && chaptersGroup.length > 0 ? (
          chaptersGroup.map((cg) => {
            const publishedChapters = chapters
              .filter((ch) => ch.groupId === cg.id)
              .filter(
                (ch) => ch.publicDate && new Date(ch.publicDate) < new Date()
              );

            if (publishedChapters.length === 0) return null;

            return (
              <ChaptersGroupDisplay
                key={cg.id}
                cg={cg}
                chapters={publishedChapters}
              />
            );
          })
        ) : (
          <NothingHereYet />
        )}
      </div>
    </div>
  );
};

export default SeeChapters;
