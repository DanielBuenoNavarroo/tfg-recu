import { z } from "zod";
import { GENRE_ENUM, ROLE_ENUM, STATUS_ENUM } from "@/db/schema";

const BASE_STRING_LENGTH = 3;
const BASE_PASSWORD_LENGTH = 8;

export const signUpSchema = z.object({
  fullName: z.string().min(BASE_STRING_LENGTH),
  email: z.email(),
  password: z.string().min(BASE_PASSWORD_LENGTH),
});

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(BASE_PASSWORD_LENGTH),
});

export const userSchema = z.object({
  fullName: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(6),
  status: z.enum(STATUS_ENUM.enumValues).default("PENDING"),
  role: z.enum(ROLE_ENUM.enumValues).default("DEFAULT"),
  lastActivityDate: z.date().optional(),
  createdAt: z.date().optional(),
});

export const bookSchema = z.object({
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(2).max(100),
  genre: z.array(z.enum(GENRE_ENUM.enumValues)).min(1),
  coverImage: z.string().optional(),
  coverColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-F]{6}$/i),
});

export type bookSchemaType = z.infer<typeof bookSchema>;
