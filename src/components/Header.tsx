"use client";

import { getFirstName, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import Link from "next/link";
import { Session } from "next-auth";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { signOutWithRedirect } from "@/lib/actions/auth";

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link
        href={"/"}
        className="flex justify-center items-center gap-2 border-b-2 border-slate-400"
      >
        <Image
          src={"/images/studio-logo.webp"}
          alt="Logo"
          width={50}
          height={50}
        />
      </Link>
      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link
            href={"/books"}
            className={
              "text-base cursor-pointer capitalize text-slate-100 hover:text-slate-300"
            }
          >
            Browse
          </Link>
        </li>
        <li>
          <Link
            href={"/my-library/recent"}
            className={
              "text-base cursor-pointer capitalize text-slate-100 hover:text-slate-300"
            }
          >
            Library
          </Link>
        </li>
        <li>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 font-bold">
                <Avatar>
                  <AvatarFallback className="">
                    {getInitials(session?.user?.name || "IN")}
                  </AvatarFallback>
                </Avatar>
                <p className="truncate max-w-24 hidden md:block">
                  {getFirstName(session?.user?.name || "User")}
                </p>
              </button>
            </PopoverTrigger>

            <PopoverContent className="rounded shadow-md w-48 p-0! select-none">
              <div className="w-full p-2 py-3">
                <p className="text-sm truncate-1-lines">{session.user.name}</p>
                <p className="text-sm truncate-1-lines text-slate-400">
                  {session.user.email}
                </p>
              </div>
              <Separator />
              <div className="px-1.5 pt-2 text-sm font-bold">Default</div>
              <ul className="flex flex-col gap-2 text-sm p-2 w-full">
                <li className="w-full">
                  <Link href="/" className="flex hover:text-blue-400">
                    Home
                  </Link>
                </li>
                <li className="w-full">
                  <Link href="/books" className="flex hover:text-blue-400">
                    Browse
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    href="/my-library/recent"
                    className="flex hover:text-blue-400"
                  >
                    Library
                  </Link>
                </li>
              </ul>
              <Separator />
              <div className="px-1.5 pt-2 text-sm font-bold">Account</div>
              <ul className="flex flex-col gap-2 text-sm p-2 w-full">
                <li className="w-full">
                  <Link href="/settings" className="flex hover:text-blue-400">
                    Settings
                  </Link>
                </li>
                <li className="w-full">
                  <div className="flex hover:text-blue-400">
                    Notifications{" "}
                    <span className="text-xs text-red-500">(soon)</span>
                  </div>
                </li>
              </ul>
              {session.user.role !== "DEFAULT" && (
                <>
                  <Separator />
                  <div className="px-1.5 pt-2 text-sm font-bold">Author</div>
                  <ul className="flex flex-col gap-2 text-sm p-2 w-full">
                    <li className="w-full">
                      <Link
                        href="/created"
                        className="flex hover:text-blue-400"
                      >
                        Created Books
                      </Link>
                    </li>
                  </ul>
                </>
              )}
              {session.user.role === "ADMIN" && (
                <>
                  <Separator />
                  <div className="px-1.5 pt-2 text-sm font-bold">Admin</div>
                  <ul className="flex flex-col gap-2 text-sm p-2 w-full">
                    <li className="w-full">
                      <Link href="/admin" className="flex hover:text-blue-400">
                        Dashboard
                      </Link>
                    </li>
                  </ul>
                </>
              )}
              <Separator />
              <div className="p-2">
                <form action={signOutWithRedirect}>
                  <Button
                    className="text-sm w-full text-left! justify-start text-red-500"
                    variant={"ghost"}
                    size={"sm"}
                    type="submit"
                  >
                    <LogOut />
                    Log out
                  </Button>
                </form>
              </div>
            </PopoverContent>
          </Popover>
        </li>
      </ul>
    </header>
  );
};

export default Header;
