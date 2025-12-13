import { relations, sql } from "drizzle-orm";
import {
  integer,
  text,
  pgTable,
  uuid,
  varchar,
  pgEnum,
  date,
  timestamp,
  foreignKey,
  numeric,
  check,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const STATUS_ENUM = pgEnum("status", ["PENDING", "APPROVED", "BLOCKED"]);
export const ROLE_ENUM = pgEnum("role", ["AUTHOR", "ADMIN", "DEFAULT"]);
export const GENRE_ENUM = pgEnum("genre", [
  "Action",
  "Adult",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Gender Bender",
  "Harem",
  "Historical",
  "Horror",
  "Josei",
  "Martial Arts",
  "Mature",
  "Mecha",
  "Mystery",
  "Psychological",
  "Romance",
  "School Life",
  "Sci-fi",
  "Seinen",
  "Shoujo",
  "Shounen",
  "Slice of Life",
  "Smut",
  "Sports",
  "Supernatural",
  "Tragedy",
  "Wuxia",
  "Xianxia",
  "Xuanhuan",
  "Yaoi",
  "Yuri",
  "Other",
]);
export const BOOK_STATUS_ENUM = pgEnum("book_status", [
  "Completed",
  "Ongoing",
  "Hiatus",
  "Droped",
]);

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  status: STATUS_ENUM("status").default("APPROVED"),
  role: ROLE_ENUM("role").default("DEFAULT"),
  lastActivityDate: date("last_activity_date").defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const books = pgTable("books", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  genre: GENRE_ENUM("genre")
    .array()
    .notNull()
    .default(sql`ARRAY['Other']::genre[]`),
  coverImage: text("cover_image").default(
    "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ),
  status: BOOK_STATUS_ENUM("status").default("Ongoing"),
  isPublic: boolean("is_public").notNull().default(false),
  coverColor: varchar("cover_color", { length: 7 }).default("#314158"),
  price: numeric("price", { precision: 10, scale: 2 }).default(sql`0`), 
  currency: varchar("currency", { length: 3 }).default("EUR"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const purchases = pgTable("purchases", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  bookId: uuid("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  amountPaid: numeric("amount_paid", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("EUR"),
  purchasedAt: timestamp("purchased_at", { withTimezone: true }).defaultNow(),
});

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bookId: uuid("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    rating: integer().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    ratingCheck: check(
      "rating_between_0_and_5",
      sql`${table.rating} >= 0 AND ${table.rating} <= 5`
    ),
  })
);

export const reviewVotes = pgTable(
  "review_votes",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    reviewId: uuid("review_id")
      .notNull()
      .references(() => reviews.id, { onDelete: "cascade" }),
    isLike: boolean("is_like").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    uniqueUserReview: uniqueIndex("unique_user_review").on(
      table.userId,
      table.reviewId
    ),
  })
);

export const chapterGroups = pgTable("chapter_groups", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  bookId: uuid("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  order: integer("order").default(0),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const chapters = pgTable("chapters", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  bookId: uuid("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  groupId: uuid("group_id").references(() => chapterGroups.id, {
    onDelete: "set null",
  }),
  order: integer("order").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  visits: integer("visits").default(0),
  isPublic: boolean("is_public").notNull().default(false),
  publicDate: timestamp("public_date", { withTimezone: true }),
  content: text("content").notNull().default(""),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const bookLists = pgTable("book_lists", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const bookListItems = pgTable(
  "book_list_items",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    listId: uuid("list_id")
      .notNull()
      .references(() => bookLists.id, { onDelete: "cascade" }),
    bookId: uuid("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    addedAt: timestamp("added_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    uniqueBookInList: uniqueIndex("unique_book_in_list").on(
      table.listId,
      table.bookId
    ),
  })
);

export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  bookId: uuid("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniqueBookmark: uniqueIndex("unique_bookmark").on(table.userId, table.bookId),
}));

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

    parentCommentId: uuid("parent_comment_id").references(() => comments.id, {
      onDelete: "cascade",
    }),

    content: text("content").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    validTargetCheck: check(
      "valid_target_check",
      sql`(
        (book_id IS NOT NULL AND chapter_id IS NULL)
        OR
        (book_id IS NULL AND chapter_id IS NOT NULL)
      )`
    ),
    parentFk: foreignKey({
      columns: [table.parentCommentId],
      foreignColumns: [table.id],
    }),
  })
);

export const booksRelations = relations(books, ({ one }) => ({
  author: one(users, {
    fields: [books.authorId],
    references: [users.id],
  }),
}));

export const chapterGroupsRelations = relations(
  chapterGroups,
  ({ many, one }) => ({
    book: one(books, {
      fields: [chapterGroups.bookId],
      references: [books.id],
    }),
    chapters: many(chapters),
  })
);

export const chaptersRelations = relations(chapters, ({ one }) => ({
  book: one(books, {
    fields: [chapters.bookId],
    references: [books.id],
  }),
  group: one(chapterGroups, {
    fields: [chapters.groupId],
    references: [chapterGroups.id],
  }),
}));

export const bookListsRelations = relations(bookLists, ({ one, many }) => ({
  user: one(users, {
    fields: [bookLists.userId],
    references: [users.id],
  }),
  items: many(bookListItems),
}));

export const bookListItemsRelations = relations(bookListItems, ({ one }) => ({
  list: one(bookLists, {
    fields: [bookListItems.listId],
    references: [bookLists.id],
  }),
  book: one(books, {
    fields: [bookListItems.bookId],
    references: [books.id],
  }),
}));