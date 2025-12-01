import { z } from "zod";

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
