import {
  BOOK_STATUS_ENUM,
  GENRE_ENUM,
  ROLE_ENUM,
  STATUS_ENUM,
} from "./db/schema";

interface Book {
  id: string;
  title: string;
  authorId: string;
  genre: (typeof GENRE_ENUM.enumValues)[number][];
  description: string;
  color: string;
  cover: string;
  status: (typeof BOOK_STATUS_ENUM.enumValues)[number];
  isPublic: boolean;
  lastUpdated: Date;
  createdAt: Date;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  status: (typeof STATUS_ENUM.enumValues)[number];
  role: (typeof ROLE_ENUM.enumValues)[number];
  lastActivityDate: Date;
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
}
