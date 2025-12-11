"use client";

import { ChapterType } from "@/db/selects";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import TooltipWrapper from "../TooltipWrapper";
import {
  MoreVerticalIcon,
  TrashIcon,
} from "lucide-react";
import DeleteChapterDialog from "./DeleteChapterDialog";
import { UpdateCType } from "./ChapterCreationPage";
import PublicChapterPicker from "./PublicChapterPicker";

interface Props {
  chapter: ChapterType;
  deleteC: (id: string) => void;
  updateC: UpdateCType;
}

const ChapterActions = ({ chapter, deleteC, updateC }: Props) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DeleteChapterDialog
        chapterId={chapter.id}
        deleteC={deleteC}
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center justify-center ml-4">
            <TooltipWrapper content={"More actions"}>
              <div className="flex items-center justify-center w-full h-full">
                <MoreVerticalIcon size={18} />
              </div>
            </TooltipWrapper>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <PublicChapterPicker chapter={chapter} updateC={updateC} />
          <DropdownMenuItem
            className="text-destructive flex items-center gap-2"
            onSelect={() => setShowDeleteDialog((prev) => !prev)}
          >
            <TrashIcon className="stroke-red-400" size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ChapterActions;
