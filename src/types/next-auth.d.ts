import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    role: "AUTHOR" | "ADMIN" | "DEFAULT";
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "AUTHOR" | "ADMIN" | "DEFAULT";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    role: "AUTHOR" | "ADMIN" | "DEFAULT";
  }
}
