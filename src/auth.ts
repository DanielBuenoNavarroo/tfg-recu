import { compare } from "bcryptjs";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { User } from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email.toString()))
          .limit(1);

        if (user.length === 0) return null;

        const isPasswordValid = await compare(
          credentials.password.toString(),
          user[0].password
        );

        if (!isPasswordValid) return null;

        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].fullName,
          role: user[0].role,
        } as User;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as "AUTHOR" | "ADMIN" | "DEFAULT";
      }

      return session;
    },
    authorized({ request }) {
      const url = request.nextUrl;

      if (url.pathname.startsWith("/api")) {
        const origin = request.headers.get("origin");

        const allowed = ["http://localhost:3000"];

        if (!origin || !allowed.includes(origin)) {
          return false;
        }
      }

      return true;
    },
  },
});
