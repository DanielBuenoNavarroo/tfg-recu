import { InferSelectModel } from "drizzle-orm";
import { books, chapterGroups, chapters, reviews, users } from "./schema";

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
  title: books.title,
  status: books.status,
  isPublic: books.isPublic,
  createdAt: books.createdAt,
  lastUpdated: books.lastUpdated,
};

export const publicReviewsFields = {
  id: reviews.id,
  title: reviews.title,
  description: reviews.description,
  rating: reviews.rating,
  createdAt: reviews.createdAt,
};

export const publicChapterGroupFields = {
  id: chapterGroups.id,
  bookId: chapterGroups.bookId,
  name: chapterGroups.name,
  isPublic: chapterGroups.isPublic,
  order: chapterGroups.order,
  createdAt: chapterGroups.createdAt,
};

export const publicChapterFields = {
  id: chapters.id,
  bookId: chapters.bookId,
  groupId: chapters.groupId,
  isPublic: chapters.isPublic,
  publicDate: chapters.publicDate,
  order: chapters.order,
  title: chapters.title,
  visits: chapters.visits,
  lastUpdated: chapters.lastUpdated,
  createdAt: chapters.createdAt,
};

export type PublicUser = Pick<
  InferSelectModel<typeof users>,
  | "id"
  | "fullName"
  | "email"
  | "status"
  | "role"
  | "lastActivityDate"
  | "createdAt"
>;

export type PublicBook = Pick<
  InferSelectModel<typeof books>,
  | "id"
  | "authorId"
  | "description"
  | "coverColor"
  | "coverImage"
  | "genre"
  | "title"
  | "status"
  | "isPublic"
  | "createdAt"
  | "lastUpdated"
>;

export type ReviewType = Pick<
  InferSelectModel<typeof reviews>,
  "id" | "title" | "description" | "rating" | "createdAt"
> & {
  thumbsUp: number;
  thumbsDown: number;
  currentUserVote: 0 | 1 | null;
};

export type ReviewUser = PublicUser;

export type ReviewWithUserType = ReviewType & {
  user: ReviewUser;
};

export type ChapterGroupType = {
  id: string;
  bookId: string;
  name: string;
  isPublic: boolean;
  order: number;
  createdAt: Date;
};

export type ChapterType = {
  id: string;
  bookId: string;
  groupId: string | null;
  isPublic: boolean;
  order: number;
  title: string | null;
  visits: number;
  publicDate?: Date;
  lastUpdated: Date;
  createdAt: Date;
};
