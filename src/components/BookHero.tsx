"use client";

import { BookOpen, Star } from "lucide-react";
import { Button } from "./ui/button";
import BookCover from "./BookCover";
import { Book as BookType, User } from "@/types";
import { useEffect, useState } from "react";
import { getReviewsAverage } from "@/lib/actions/reviews";
import Link from "next/link";

type BookWithViews = BookType & {
  totalViews: number;
  author: User;
};

const BookHero = ({ book }: { book: BookWithViews }) => {
  const [reviewA, setReviewA] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const res = await getReviewsAverage(book.id);

      if (res.succes) {
        setReviewA(res.data?.averageRating ?? 0);
      }
    };

    getData();
  }, [book]);

  const formatter = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <section className="mt-20 flex flex-col-reverse items-center gap-12 sm:gap-32 xl:flex-row xl:gap-8">
      <div className="flex flex-1 flex-col gap-5">
        <h1 className="text-5xl font-semibold md:text-7xl">{book.title}</h1>
        <div className="mt-7 flex flex-row flex-wrap gap-4 text-xl">
          <p>
            By{" "}
            <span className="font-semibold text-light-200">
              {book.author.fullName}
            </span>
          </p>
          <div className="flex flex-row gap-1 items-center">
            <Star
              width={22}
              height={22}
              className="stroke-yellow-400 fill-yellow-400"
            />
            <p>{formatter.format(reviewA)} / 5</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <p className="text-xl">Categories</p>
          {book &&
            book.genre.map((g) => (
              <div
                className="bg-emerald-900 px-2 py-0.5 rounded-sm text-sm cursor-default select-none"
                key={g}
              >
                <p>{g}</p>
              </div>
            ))}
        </div>
        <div className="">
          <h1 className="text-xl">Description</h1>
          <p className="mt-2 text-justify text-lg text-slate-300">
            {book.description}
          </p>
        </div>
        <Button className="mt-4 min-h-14 w-fit max-md:w-full" asChild>
          <Link href={`/books/${book.id}`}>
            <BookOpen width={40} height={40} className="fill-slate-800" />
            <p className="text-2xl">See now</p>
          </Link>
        </Button>
      </div>

      <div className="relative flex flex-1 justify-center w-fit">
        <div className="relative">
          <BookCover
            variant="wide"
            className="z-10"
            coverColor={book.color}
            coverUrl={book.cover.trim() === "" ? undefined : book.cover}
          />
        </div>
        <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
          <BookCover
            variant="wide"
            coverColor={book.color}
            coverUrl={book.cover.trim() === "" ? undefined : book.cover}
          />
        </div>
      </div>
    </section>
  );
};

export default BookHero;
