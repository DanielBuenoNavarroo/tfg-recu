"use client";

import { getFirstName, getInitials } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import Link from "next/link";
import { Session } from "next-auth";
import Image from "next/image";

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
        {session.user.role !== "DEFAULT" && (
          <li>
            <Link
              href={"/created"}
              className={
                "text-base cursor-pointer capitalize text-slate-100 hover:text-slate-300"
              }
            >
              Created
            </Link>
          </li>
        )}
        {session.user.role === "ADMIN" && (
          <li>
            <Link
              href={"/admin"}
              className={
                "text-base cursor-pointer capitalize text-slate-100 hover:text-slate-300"
              }
            >
              Dashboard
            </Link>
          </li>
        )}
        <li>
          <Link href={"/profile"} className="flex items-center gap-2 font-bold">
            <Avatar>
              <AvatarFallback className="bg-blue-200 text-black">
                {getInitials(session?.user?.name || "IN")}
              </AvatarFallback>
            </Avatar>
            <p className="truncate max-w-24 hidden md:block">
              {getFirstName(session?.user?.name || "User")}
            </p>
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
