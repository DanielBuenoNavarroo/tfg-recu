import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { books, chapterGroups, chapters } from "./schema";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

const chapterData = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
`;

function getRandomChapterCount(): number {
  return Math.floor(Math.random() * 11) + 10;
}

function getChronologicalDates(count: number): Date[] {
  const now = Date.now();
  const fourYearsAgo = now - 4 * 365 * 24 * 60 * 60 * 1000;

  return Array.from({ length: count }).map((_, i) => {
    const ratio = i / (count - 1);
    const timestamp = fourYearsAgo + ratio * (now - fourYearsAgo);
    return new Date(timestamp);
  });
}

const seedChapters = async () => {
  console.log("Seeding capítulos...");

  try {
    const allBooks = await db.select().from(books);

    for (const book of allBooks) {
      const [group] = await db
        .insert(chapterGroups)
        .values({
          bookId: book.id,
          name: "Season 1",
          order: 1,
          isPublic: true,
        })
        .returning();

      const chapterCount = getRandomChapterCount();
      const dates = getChronologicalDates(chapterCount);
      const newChapters = Array.from({ length: chapterCount }).map((_, i) => ({
        bookId: book.id,
        groupId: group.id,
        order: i + 1,
        title: `Chapter ${i + 1}`,
        isPublic: true,
        content: chapterData,
        publicDate: dates[i],
      }));

      await db.insert(chapters).values(newChapters);

      console.log(
        `Libro "${book.title}" → grupo creado con ${chapterCount} capítulos`
      );
    }

    console.log("Seeder de capítulos completado");
  } catch (e) {
    console.error("Error al hacer seed de capítulos:", e);
  }
};

seedChapters();
