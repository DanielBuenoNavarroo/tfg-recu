"use client";

import { ChapterType } from "@/db/selects";
import { useSortable } from "@dnd-kit/sortable";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import ChapterActions from "./ChapterActions";
import { Button } from "../ui/button";
import {
  ChevronRight,
  Loader,
  LockKeyhole,
  LockKeyholeOpen,
} from "lucide-react";
import { UpdateCType } from "./ChapterCreationPage";
import TooltipWrapper from "../TooltipWrapper";
import Link from "next/link";

interface Props {
  chapter: ChapterType;
  deleteC: (id: string) => void;
  updateC: UpdateCType;
}

const ChapterCard = ({ chapter, deleteC, updateC }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [tempTitle, setTempTitle] = useState(chapter.title ?? "");

  console.log(chapter);

  const {
    setNodeRef,
    attributes,
    listeners,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: chapter.id,
    data: {
      type: "Chapter",
      chapter,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-900 p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500 cursor-grab select-none relative opacity-30"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      className="bg-slate-900 items-center flex text-left rounded-md select-none relative p-2.5"
    >
      <p className="mx-2.5 border px-2 py-1 text-sm rounded-sm bg-slate-800">
        {chapter.order}
      </p>
      {!editMode && (
        <p
          onClick={() => setEditMode(true)}
          className="my-auto w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap"
        >
          {chapter.title}
        </p>
      )}
      {editMode && (
        <input
          value={tempTitle}
          type="text"
          autoFocus
          onChange={(e) => setTempTitle(e.target.value)}
          onBlur={() => setEditMode(false)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;

            if (tempTitle.trim() === "") return;

            updateC(chapter.id, { title: tempTitle });
            setEditMode(false);
          }}
          className="w-full! bg-slate-900/50 border rounded outline-none px-2 h-full"
        />
      )}
      <div
        className={cn(
          chapter.isPublic
            ? new Date(chapter.publicDate ?? "") > new Date()
              ? "text-yellow-400" // pending
              : "text-green-500" // published
            : "text-red-400", // private
          "border rounded-sm p-2 text-xs ml-2"
        )}
      >
        {chapter.isPublic ? (
          new Date(chapter.publicDate ?? "") > new Date() ? (
            // Pending
            <TooltipWrapper
              content={
                chapter.publicDate
                  ? new Intl.DateTimeFormat(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(chapter.publicDate))
                  : ""
              }
            >
              <div className="flex items-center gap-2 min-w-16 w-16 justify-between">
                Pending
                <Loader size={12} />
              </div>
            </TooltipWrapper>
          ) : (
            // Published
            <TooltipWrapper
              content={
                chapter.publicDate
                  ? new Intl.DateTimeFormat(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(chapter.publicDate))
                  : ""
              }
            >
              <div className="flex items-center gap-2 min-w-16 w-16 justify-between">
                Public
                <LockKeyholeOpen size={12} />
              </div>
            </TooltipWrapper>
          )
        ) : (
          <div className="flex items-center gap-2 min-w-16 w-16 justify-between">
            Private <LockKeyhole size={12} />
          </div>
        )}
      </div>
      <ChapterActions chapter={chapter} deleteC={deleteC} updateC={updateC} />
      <Button variant={"ghost"} size={"icon-sm"} className="ml-2" asChild>
        <Link href={`/created/${chapter.bookId}/edit/${chapter.id}`}>
          <ChevronRight />
        </Link>
      </Button>
    </div>
  );
};

export default ChapterCard;
