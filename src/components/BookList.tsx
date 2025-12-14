import { Book, User } from "@/types";
import BookCard from "./BookCard";
import Link from "next/link";

type BookWithViews = Book & {
  totalViews: number;
  author: User;
};

interface Props {
  title: string;
  books: BookWithViews[];
  containerClassName?: string;
}

const BookList = ({ title, books, containerClassName }: Props) => {
  return (
    <section className={containerClassName}>
      <Link href={""}>
      </Link>
      <h2 className="text-4xl">{title}</h2>
      <ul className="mt-10 flex flex-wrap gap-5 max-xs:justify-between justify-center xs:gap-10">
        {books.map((book) => (
          <BookCard key={book.id} {...book} />
        ))}
      </ul>
    </section>
  );
};

export default BookList;
