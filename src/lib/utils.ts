import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const getFirstName = (name: string) => name.split(" ")[0];

export const minimize = (word: string) => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
};
