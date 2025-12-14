import { neon } from "@neondatabase/serverless";
import UsersData from "../seed-data/names.json";
import BooksData from "../seed-data/books.json";
import { drizzle } from "drizzle-orm/neon-http";
import { hash } from "bcryptjs";
import {
  ROLE_ENUM,
  STATUS_ENUM,
  users,
  books,
  GENRE_ENUM,
  GENRE_ENUM_TYPE,
} from "./schema";
import { config } from "dotenv";
import { BookParams } from "@/types";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

type BookParamsSeed = BookParams & {
    authorId: string;
    isPublic: boolean;
    price: string;
    currency: string;
};

function getRandomGenres(): GENRE_ENUM_TYPE[] {
  const count = Math.floor(Math.random() * 5) + 1; // entre 1 y 5
  const shuffled = [...GENRE_ENUM.enumValues].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count) as unknown as GENRE_ENUM_TYPE[];
}

function getRandomPrice(): string {
  return (Math.random() * 10).toFixed(2);
}

const seed = async () => {
  console.log("Seeding data...");

  try {
    const formattedUsers = await Promise.all(
      UsersData.map(async (u) => {
        const pass = await hash(u.password, 10);
        return {
          fullName: u.username,
          email: u.email,
          password: pass,
          role: ROLE_ENUM.enumValues[0],
          status: STATUS_ENUM.enumValues[1],
        };
      })
    );

    await db.insert(users).values(formattedUsers);

    console.log("Usuarios insertados correctamente");

    const authors = await db.select().from(users);

    const formattedBooks: BookParamsSeed[] = [];
    authors.forEach((author, index) => {
      const start = index * 10;
      const end = start + 10;
      const slice = BooksData.slice(start, end);

      slice.forEach((b) => {
        formattedBooks.push({
          authorId: author.id,
          title: b.title,
          description: b.description || "Sin descripción",
          genre: getRandomGenres(),
          coverImage: b.coverUrl || "",
          isPublic: true,
          coverColor: "#314158",
          price: getRandomPrice(),
          currency: "EUR",
        });
      });
    });

    await db.insert(books).values(formattedBooks);

    console.log("Libros insertados correctamente");
  } catch (e) {
    console.error("Error al hacer seed:", e);
  }
};

seed();

