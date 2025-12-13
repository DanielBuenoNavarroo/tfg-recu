"use client";

import { libraryLinks } from "@/constants";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const MyLibraryHeader = () => {
  const path = usePathname();
  return libraryLinks.map((link) => (
    <Button asChild key={link.label} variant={"ghost"}>
      <Link href={link.href}>
        <p
          className={cn(
            "uppercase font-bold",
            path.includes(link.href) ? "text-blue-400" : "text-slate-300"
          )}
        >
          {link.label}
        </p>
      </Link>
    </Button>
  ));
};

export default MyLibraryHeader;
