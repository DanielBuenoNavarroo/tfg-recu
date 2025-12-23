"use server";

import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { authorRequests, users } from "@/db/schema";
import { hash } from "bcryptjs";
import { auth, signIn, signOut } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ratelimit from "../ratelimit";
import { AuthCredentials } from "@/types";
import { publicUserFields } from "@/db/selects";

export const signInWithCredentials = async ({
  email,
  password,
}: Pick<AuthCredentials, "email" | "password">) => {
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect("/too-fast");

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: "SignIn error" };
  }
};

export const signUp = async ({
  email,
  fullName,
  password,
}: AuthCredentials) => {
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) return redirect("/too-fast");

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }

  const hashP = await hash(password, 10);

  try {
    await db.insert(users).values({
      fullName,
      email,
      password: hashP,
    });

    await signInWithCredentials({ email, password });

    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false, error: "SignUp error" };
  }
};

export const signOutWithRedirect = async () => {
  await signOut({ redirectTo: "/sign-in" });
};

export const UserStatus = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  try {
    const result = await db
      .select({ status: users.status })
      .from(users)
      .where(eq(users.id, session.user.id));

    const status = result[0]?.status;

    return { success: true, status };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Error fetching user status" };
  }
};

export const GetUserById = async (id: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  try {
    const result = await db
      .select(publicUserFields)
      .from(users)
      .where(eq(users.id, id));

    return { success: true, result: result[0] };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Error fetching user" };
  }
};

export const hasUserRequestedAuthor = async () => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const result = await db
      .select({ id: authorRequests.id })
      .from(authorRequests)
      .where(eq(authorRequests.userId, session.user.id))
      .limit(1);

    return result.length > 0; // true si ya existe una petición
  } catch (e) {
    console.error("Error checking author request:", e);
    return false;
  }
};
