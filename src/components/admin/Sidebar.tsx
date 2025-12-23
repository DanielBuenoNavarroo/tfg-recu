"use client";

import Image from "next/image";
import { adminSideBarLinks } from "@/constants";
import Link from "next/link";
import { cn, getInitials } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";

const Sidebar = ({ session }: { session: Session }) => {
  const pathname = usePathname();

  return (
    <div className="sticky left-0 top-0 flex h-dvh flex-col justify-between px-5 pb-5 pt-10 border-r-2 border-dashed border-slate-400">
      <div>
        <div className="flex flex-row items-center justify-center max-md:justify-center gap-2 pb-10 border-b-2 border-dashed border-slate-400">
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
        </div>
        <div className="flex flex-col gap-4 mt-10">
          {adminSideBarLinks.map((link) => {
            const isSelected =
              (link.route !== "/admin" &&
                pathname.includes(link.route) &&
                link.route.length > 1) ||
              pathname === link.route;

            return (
              <Link href={link.route} key={link.route}>
                <div
                  className={cn(
                    "w-full flex flex-row items-center max-md:justify-center gap-2 rounded-lg px-5 py-3.5",
                    isSelected ? "bg-neutral-300" : "hover:bg-slate-700"
                  )}
                >
                  <div className="relative">
                    <link.img
                      color={isSelected ? "black" : "white"}
                      size={25}
                    />
                  </div>
                  <p
                    className={cn(
                      isSelected
                        ? "text-black border-black"
                        : "border-slate-400",
                      "text-base font-medium max-md:hidden border-l-2 pl-2"
                    )}
                  >
                    {link.text}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="w-full my-8 flex items-center justify-center flex-row gap-2 rounded-full shadow-sm max-md:px-2">
        <Avatar>
          <AvatarFallback className="bg-blue-800 border-2 border-slate-600">
            {getInitials(session?.user?.name || "IN")}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col max-md:hidden">
          <p className="font-semibold text-dark-200">{session?.user?.name}</p>
          <p className="text-xs text-light-500">{session?.user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
