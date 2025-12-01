import BookHero from "@/components/BookHero";
import BookList from "@/components/BookList";
import { sampleBooks } from "@/constants";

export default function Home() {
  return (
    <>
      <BookHero {...sampleBooks[0]} />
      <BookList title="Latest Books" books={sampleBooks} containerClassName="mt-28" />
    </>
  );
}
