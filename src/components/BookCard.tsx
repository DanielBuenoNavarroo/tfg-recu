import Link from "next/link";
import BookCover from "./BookCover";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { Button } from "./ui/button";

const BookCard = ({
  id,
  title,
  genre,
  color,
  cover,
  isLoanedBook = false,
}: Book) => {
  return (
    <li className={cn(isLoanedBook && "xs:w-52 w-full")}>
      <Link
        href={`/books/${id}`}
        className={cn(isLoanedBook && "w-full flex flex-col items-center")}
      >
        <BookCover coverColor={color} coverUrl={cover} />
        <div className={cn("mt-4", !isLoanedBook && "sm:max-w-40 max-w-28")}>
          <p className="mt-2 line-clamp-1 text-base font-semibold xs:text-xl">
            {title}
          </p>
          <p className="mt-1 line-clamp-1 text-sm italic text-gray-400 xs:text-base">
            {genre}
          </p>
        </div>
        {isLoanedBook && (
          <div className="mt-3 w-full">
            <div className="flex flex-row items-center gap-1 max-xs:justify-center">
              <Calendar height={18} width={18} className="object-contain" />
              <p className="text-gray-400">11 days left to return</p>
            </div>
            <Button className="mt-3 min-h-14 w-full text-base">
              Download receipt
            </Button>
          </div>
        )}
      </Link>
    </li>
  );
};

export default BookCard;
