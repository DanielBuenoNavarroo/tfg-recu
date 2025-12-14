import Link from "next/link";
import BookCover from "./BookCover";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Book } from "@/types";

const BookCard = ({ id, title, genre, color, cover }: Book) => {
  return (
    <li>
      <Link href={`/books/${id}`}>
        <BookCover
          coverColor={color}
          coverUrl={cover.trim() === "" ? undefined : cover}
        />
        <div className={cn("mt-4 sm:max-w-40 max-w-28")}>
          <p className="mt-2 line-clamp-1 text-base font-semibold xs:text-xl">
            {title}
          </p>
          <div className="">
            <p className="mt-1 line-clamp-1 text-sm italic text-gray-400 xs:text-base">
              {genre}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default BookCard;
