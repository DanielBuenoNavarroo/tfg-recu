"use client";

import { Button } from "@/components/ui/button";
import { ChapterGroupType, ChapterType } from "@/db/selects";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ChaptersGroupDisplay = ({
  cg,
  chapters,
}: {
  cg: ChapterGroupType;
  chapters: ChapterType[];
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div
      className={cn(open ? "rounded-t-md h-auto" : "rounded-md h-10", "mb-4")}
      key={cg.id}
    >
      <div
        className={cn(
          "flex justify-between items-center bg-slate-800 px-3 py-2 cursor-pointer select-none font-bold",
          open ? "rounded-t-md" : "rounded-md"
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        {cg.name}{" "}
        <ChevronUp
          size={18}
          className={cn(
            !open && "rotate-180",
            "transition-transform duration-300"
          )}
        />
      </div>
      {open &&
        chapters.map((c) => (
          <div
            className="w-full border-b border-x flex items-center justify-between px-3 py-4 select-none"
            key={c.id}
          >
            <div className="flex items-center justify-center gap-4">
              <div className="text-slate-400">{c.order}</div>
              <div className="">
                {c.title}
                <p className="text-xs text-slate-400">
                  Last updated:{" "}
                  {c?.lastUpdated
                    ? new Intl.DateTimeFormat(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(c.lastUpdated))
                    : ""}
                </p>
              </div>
            </div>
            <Button asChild variant={"outline"}>
              <Link href={`/books/${cg.bookId}/chapters/${c.id}`}>Read</Link>
            </Button>
          </div>
        ))}
    </div>
  );
};

export default ChaptersGroupDisplay;
