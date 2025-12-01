"use client";

import { cn, getFirstName, getInitials } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import Link from "next/link";
import { Session } from "next-auth";

const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname();
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href={"/"} className="flex justify-center items-center gap-2">
        <BookOpen width={40} height={40} />
      </Link>
      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link
            href={"/library"}
            className={cn(
              "text-base cursor-pointer capitalize",
              pathname === "/library" ? "text-gray-300" : "text-gray-100"
            )}
          >
            Library
          </Link>
        </li>
        <li>
          <Link href={"/profile"} className="flex items-center gap-2 font-bold">
            <Avatar>
              <AvatarFallback className="bg-blue-200 text-black">
                {getInitials(session?.user?.name || "IN")}
              </AvatarFallback>
            </Avatar>
            <p className="truncate max-w-24">{getFirstName(session?.user?.name || "User")}</p>
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
