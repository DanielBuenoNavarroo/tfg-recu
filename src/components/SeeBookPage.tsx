"use client";

import BookCover from "@/components/BookCover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ReviewWithUserType } from "@/db/selects";
import { useReviewVotes } from "@/hooks/useReviewVotes";
import { getBookById } from "@/lib/actions/book";
import { cn } from "@/lib/utils";
import { Book, User as UserType } from "@/types";
import {
  Bookmark,
  Calendar,
  Eye,
  Plus,
  Star,
  ThumbsDown,
  ThumbsUp,
  Trash,
  User,
} from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import NothingHereYet from "./NothingHereYet";

const SeeBookPage = ({ id, session }: { id: string; session: Session }) => {
  const [book, setBook] = useState<Book | null>(null);
  const [author, setAuthor] = useState<UserType | null>(null);
  const [visits, setVisits] = useState<number>(0);
  const [chapters, setChapters] = useState<string[]>([]);

  const {
    reviews,
    setReviews,
    likeReview,
    dislikeReview,
    getReviewAverage,
    removeReview,
  } = useReviewVotes(null);

  useEffect(() => {
    const getBook = async () => {
      const res = await getBookById(id);

      if (res.succes) {
        setBook(res.data as unknown as Book);
        setAuthor(res.data?.author as unknown as UserType);
        setReviews(res.reviews as unknown as ReviewWithUserType[]);
      }
    };

    getBook();
  }, [id, setReviews]);

  if (!book) {
    return (
      <div className=" mx-auto flex items-center">
        <h1 className="text-3xl">No book to display, try again later</h1>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-4 justify-center">
        <div className="">
          <BookCover coverColor={book.color} />
          <Button
            className="w-full mt-2 bg-light-200"
            disabled={chapters && chapters.length <= 0}
          >
            Start reading
          </Button>
          <div className="mt-2 flex">
            <Button
              variant={"ghost"}
              className="border-2 border-slate-400 w-1/2"
            >
              <Bookmark />
            </Button>
            <Button
              variant={"ghost"}
              className="border-2 border-slate-400 w-1/2"
            >
              <Plus />
            </Button>
          </div>
          <Separator className="mt-4 bg-slate-400" />
          <div className="flex gap-3 items-center justify-center pt-4">
            <div className="flex items-center gap-1">
              <Eye size={16} className="stroke-slate-300" />
              <p>{visits}</p>
            </div>
            <div className="flex items-center gap-1">
              <Star size={16} className="stroke-slate-300" />
              <p>{getReviewAverage().toFixed(1)}</p>
            </div>
          </div>
        </div>
        <div className="w-full">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            {book?.title}
          </h1>
          <div className="flex mt-4 items-center gap-4">
            <p className="text-lg lg:text-xl text-slate-300">
              {author && author?.fullName}
            </p>
            <Button
              variant={"outline"}
              className="px-3 py-0! text-xs rounded-full bg-slate-950/40!"
            >
              Subscribe
            </Button>
          </div>
          <div className="mt-4 flex gap-2 flex-wrap">
            {book &&
              book.genre.map((g) => (
                <div
                  className="bg-emerald-700 px-2 py-0.5 rounded-sm text-sm cursor-default select-none"
                  key={g}
                >
                  <p>{g}</p>
                </div>
              ))}
          </div>
          <div className="mt-2">
            <p className="text-sm/relaxed text-slate-300/90 max-h-[200px] overflow-hidden">
              {book && book.description}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        {/* Chapters */}
        <div className="flex bg-slate-900 border border-slate-600 w-full rounded-xl p-4 shadow-md shadow-slate-600 text-md items-center gap-4">
          <Calendar />
          <p className="font-bold">
            Next release: <span className="font-medium">10/12/2025</span>
          </p>
        </div>
        <div className="mt-6">
          <h2 className="text-xl md:text-2xl font-bold">Chapters</h2>
          {chapters && chapters.length > 0 ? (
            <div className="">
              <Link href={""}></Link>
              <Link href={""}></Link>
              <Link href={""}></Link>
            </div>
          ) : (
            <NothingHereYet className="h-40!" />
          )}
          <Separator className="my-6 bg-slate-600" />
          {/* Reviews */}
          <div className="">
            <h2 className="text-xl md:text-2xl font-bold">Reviews</h2>
            {reviews && reviews?.length > 0 ? (
              reviews.map((r) => (
                <React.Fragment key={r.id}>
                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div>
                          <User />
                        </div>
                        <div className="">
                          <p className="font-semibold">{r.title}</p>
                          <p className="text-xs text-slate-400">
                            {r.user.fullName}
                          </p>
                          <p className="text-xs text-slate-400">
                            {r.createdAt
                              ? r.createdAt.toLocaleDateString()
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={cn(
                              "",
                              i < r.rating && "text-yellow-500 fill-yellow-500"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">{r.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-3">
                          <Button
                            variant={
                              r.currentUserVote === 1 ? "outline" : "ghost"
                            }
                            className={cn(r.currentUserVote === 1 && "")}
                            onClick={() => likeReview(r.id)}
                          >
                            <ThumbsUp /> {r.thumbsUp}
                          </Button>
                          <Button
                            variant={
                              r.currentUserVote === 0 ? "outline" : "ghost"
                            }
                            className={cn(r.currentUserVote === 0 && "")}
                            onClick={() => dislikeReview(r.id)}
                          >
                            <ThumbsDown /> {r.thumbsDown}
                          </Button>
                        </div>
                        {r.user.id === session?.user.id && (
                          <Button
                            variant={"ghost"}
                            onClick={() => removeReview(r.id)}
                          >
                            <Trash className="stroke-red-400" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4 bg-slate-600" />
                </React.Fragment>
              ))
            ) : (
              <>
                <NothingHereYet className="h-40!" />
                <Separator className="mb-4 mt-6 bg-slate-600" />
              </>
            )}
            <Link
              href={`/books/${id}/review`}
              className="flex justify-between hover:text-slate-300 py-4 px-2"
            >
              <p className="font-bold text-sm">Add a review</p>
              <div className="flex text-yellow-500 items-center">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    size={18}
                    key={n}
                    className="fill-yellow-400 stroke-yellow-400"
                  />
                ))}
              </div>
            </Link>
          </div>
          <Separator className="my-4 bg-slate-600" />
          {/* More */}
          <div className="">
            <h2 className="text-xl md:text-2xl font-bold">More like this</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeeBookPage;
