"use client";

import { ChapterGroupType, ChapterType } from "@/db/selects";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { ChevronLeft, ChevronRight, PlusIcon } from "lucide-react";
import ChapterCard from "./ChapterCard";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import ChapterGroupActions from "./ChapterGroupActions";
import { UpdateCType } from "./ChapterCreationPage";

interface Props {
  chaptersGroup: ChapterGroupType;
  chapters: ChapterType[];
  deleteCG: (id: string) => void;
  updateCG: (
    id: string,
    data: Partial<{ name: string; order: number }>
  ) => void;
  createC: (payload: {
    groupId?: string | null;
    order: number;
    title: string;
  }) => void;
  deleteC: (id: string) => void;
  updateC: UpdateCType;
}

const ChaptersGroupContainer = ({
  chapters,
  chaptersGroup,
  createC,
  deleteC,
  deleteCG,
  updateC,
  updateCG,
}: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [tempName, setTempName] = useState(chaptersGroup.name ?? "");

  const {
    setNodeRef,
    attributes,
    listeners,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: chaptersGroup.id,
    data: { type: "", chaptersGroup },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const chaptersIds = useMemo(() => {
    return chapters.map((c) => c.id);
  }, [chapters]);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-900 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-40 border border-rose-500"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-slate-800 w-full max-h-[500px] rounded-md flex flex-col transition-all duration-300 ease-in-out",
        isOpen ? "h-[500px]" : "h-[68px]"
      )}
    >
      <div className="bg-slate-900 text-md select-none rounded-md p-3 font-bold border-slate-800 border-4 flex items-center justify-between">
        <div className="flex w-full items-center h-full gap-2">
          <Button
            variant={"ghost"}
            onClick={() => setIsOpen((prev) => !prev)}
            className="px-2!"
          >
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
          <div className="flex justify-center items-center bg-slate-800 px-2 py-1 text-sm rounded-sm border">
            {chaptersGroup.order}
          </div>
          {!editMode && (
            <p className="w-full text-xl" onClick={() => setEditMode(true)}>
              {chaptersGroup.name}
            </p>
          )}
          {editMode && (
            <input
              value={tempName}
              type="text"
              autoFocus
              onChange={(e) => setTempName(e.target.value)}
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;

                if (tempName.trim() === "") return;

                updateCG(chaptersGroup.id, { name: tempName });
                setEditMode(false);
              }}
              className="w-full! bg-slate-900/50 border rounded outline-none px-2 h-full"
            />
          )}
        </div>
        <div className="flex items-center justify-center">
          <ChapterGroupActions
            deleteCG={deleteCG}
            chaptersGroup={chaptersGroup}
          />
        </div>
      </div>
      {isOpen && (
        <>
          <div className="flex grow flex-col gap-1.5 p-2 pt-1 overflow-x-hidden overflow-y-auto">
            <SortableContext items={chaptersIds}>
              {chapters.map((c) => (
                <ChapterCard
                  key={c.id}
                  chapter={c}
                  deleteC={deleteC}
                  updateC={updateC}
                />
              ))}
            </SortableContext>
          </div>
          <Button
            variant={"outline"}
            onClick={() => {
              createC({
                groupId: chaptersGroup.id,
                order: chaptersIds.length + 1,
                title: `Chapter ${chaptersIds.length + 1}`,
              });
            }}
            className="flex gap-2 items-center border-columnBackground border-2 rounded-md p-4 border-x-columnBackground hover:bg-mainBackground active:bg-black"
          >
            <PlusIcon />
            Add Chapter
          </Button>
        </>
      )}
    </div>
  );
};

export default ChaptersGroupContainer;
