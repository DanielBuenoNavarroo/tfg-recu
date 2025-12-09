import { GENRE_ENUM } from "./db/schema";

interface Book {
  id: number;
  title: string;
  authorId: string;
  genre: (typeof GENRE_ENUM.enumValues)[number][];
  rating: number;
  description: string;
  color: string;
  cover: string;
  lastUpdated: Date;
  createdAt: Date;
}

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
}

interface BookParams {
  title: string;
  genre: (typeof GENRE_ENUM.enumValues)[number][];
  description: string;
  coverImage?: string;
  coverColor: string;
  rating?: number;
}
