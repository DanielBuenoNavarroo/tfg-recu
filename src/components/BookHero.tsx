import { Book, Star } from "lucide-react";
import { Button } from "./ui/button";
import BookCover from "./BookCover";
import { Book as BookType } from "@/types";

const BookHero = ({
  color,
  cover,
  description,
  genre,
  id,
  title,
}: BookType) => {
  return (
    <section className="mt-20 flex flex-col-reverse items-center gap-12 sm:gap-32 xl:flex-row xl:gap-8">
      <div className="flex flex-1 flex-col gap-5">
        <h1 className="text-5xl font-semibold md:text-7xl">{title}</h1>
        <div className="mt-7 flex flex-row flex-wrap gap-4 text-xl">
          <p>
            By <span className="font-semibold text-light-200">{author}</span>
          </p>
          <p>
            Category:{" "}
            <span className="font-semibold text-light-200">{genre}</span>
          </p>
          <div className="flex flex-row gap-1 items-center">
            <Star width={22} height={22} />
            <p>{rating}</p>
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-4 mt-1">
          <p className="text-xl">
            Total Books:{" "}
            <span className="ml-2 font-semibold">{total_copies}</span>
          </p>
          <p className="text-xl">
            Available Books:{" "}
            <span className="ml-2 font-semibold">{available_copies}</span>
          </p>
        </div>
        <p className="mt-2 text-justify text-xl">{description}</p>
        <Button className="mt-4 min-h-14 w-fit max-md:w-full">
          <Book width={40} height={40} />
          <p className="text-2xl">See now</p>
        </Button>
      </div>

      <div className="relative flex flex-1 justify-center w-fit">
        <div className="relative">
          <BookCover
            variant="wide"
            className="z-10"
            coverColor={color}
            coverUrl={cover}
          />
        </div>
        <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
          <BookCover
            variant="wide"
            coverColor={color}
            coverUrl={cover}
          />
        </div>
      </div>
    </section>
  );
};

export default BookHero;
