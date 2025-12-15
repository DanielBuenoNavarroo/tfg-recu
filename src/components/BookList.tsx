import { Book, User } from "@/types";
import BookCard from "./BookCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

type BookWithViews =
  | (Book & {
      totalViews: number;
      author: User;
    })
  | Book;

interface Props {
  title: string;
  books: BookWithViews[];
  containerClassName?: string;
}

const BookList = ({ title, books, containerClassName }: Props) => {
  return (
    <section className={containerClassName}>
      <h2 className="text-4xl mb-6">{title}</h2>

      <Carousel className="w-full list-none select-none">
        <CarouselContent className="flex gap-6">
          {books.map((book) => (
            <CarouselItem key={book.id} className="shrink-0 basis-44">
              <BookCard {...book} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-0 bg-slate-900!" />
        <CarouselNext className="right-0 bg-slate-900!" />
      </Carousel>
    </section>
  );
};

export default BookList;
