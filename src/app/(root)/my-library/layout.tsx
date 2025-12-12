import { Button } from "@/components/ui/button";
import { libraryLinks } from "@/constants";
import Link from "next/link";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="flex gap-4 w-full justify-center">
        {libraryLinks.map((link) => (
          <Button asChild key={link.label} variant={"ghost"}>
            <Link href={link.href}>
              <p className={"uppercase font-bold"}>{link.label}</p>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default layout;
