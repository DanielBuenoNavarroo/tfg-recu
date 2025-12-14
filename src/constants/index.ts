import { Book, Bookmark, Home, User, Users } from "lucide-react";

export const RECENT_BOOKS_KEY = "recent-books";

export const URL_ADMITED = [
  "placehold.co",
  "m.media-amazon.com",
  "images.unsplash.com",
  "covers.openlibrary.org",
]

export const libraryLinks = [
  {
    href: "/my-library/recent",
    label: "Recent",
  },
  {
    href: "/my-library/bookmarked",
    label: "Bookmarked",
  },
  {
    href: "/my-library/reading-lists",
    label: "Reading Lists",
  },
];

export const FIELD_NAMES = {
  fullName: "Full name",
  email: "Email",
  universityId: "University ID Number",
  password: "Password",
  universityCard: "Upload University ID Card",
};

export const FIELD_TYPES = {
  fullName: "text",
  email: "email",
  universityId: "number",
  password: "password",
};

export const adminSideBarLinks = [
  {
    img: Home,
    route: "/admin",
    text: "Home",
  },
  {
    img: Users,
    route: "/admin/users",
    text: "All Users",
  },
  {
    img: Book,
    route: "/admin/books",
    text: "All Books",
  },
  {
    img: Bookmark,
    route: "/admin/book-requests",
    text: "Borrow Requests",
  },
  {
    img: User,
    route: "/admin/account-requests",
    text: "Account Requests",
  },
];
