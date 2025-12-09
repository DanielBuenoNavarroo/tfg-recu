import { books, users } from "./schema";

export const publicUserFields = {
  id: users.id,
  fullName: users.fullName,
  email: users.email,
  status: users.status,
  role: users.role,
  lastActivityDate: users.lastActivityDate,
  createdAt: users.createdAt,
};

export const publicBookFields = {
  id: books.id,
  authorId: books.authorId,
  description: books.description,
  color: books.coverColor,
  cover: books.coverImage,
  genre: books.genre,
  rating: books.rating,
  title: books.title,
  createdAt: books.createdAt,
  lastUpdated: books.lastUpdated,
};
