import { relations, sql } from "drizzle-orm";
import {
  integer,
  text,
  boolean,
  pgTable,
  uuid,
  varchar,
  pgEnum,
  date,
  timestamp,
  foreignKey,
} from "drizzle-orm/pg-core";

export const STATUS_ENUM = pgEnum("status", [
  "PENDING",
  "APROVED",
  "BLOCKED",
]);
export const ROLE_ENUM = pgEnum("role", ["AUTHOR", "ADMIN", "DEFAULT"]);

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  status: STATUS_ENUM("status").default("APROVED"),
  role: ROLE_ENUM("role").default("DEFAULT"),
  lastActivityDate: date("last_activity_date").defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const books = pgTable("books", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const chapters = pgTable("chapters", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  bookId: uuid("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  number: integer("number").notNull(),
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    bookId: uuid("book_id").references(() => books.id, {
      onDelete: "cascade",
    }),

    chapterId: uuid("chapter_id").references(() => chapters.id, {
      onDelete: "cascade",
    }),

    parentCommentId: uuid("parent_comment_id")
      .references(() => comments.id, { onDelete: "cascade" }),

    content: text("content").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    validTargetCheck: sql`
      CHECK (
        (book_id IS NOT NULL AND chapter_id IS NULL)
        OR
        (book_id IS NULL AND chapter_id IS NOT NULL)
      )
    `,

    parentFk: foreignKey({
      columns: [table.parentCommentId],
      foreignColumns: [table.id],
    }),
  })
);
