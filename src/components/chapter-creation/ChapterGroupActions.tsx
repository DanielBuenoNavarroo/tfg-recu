"use client";

import { ChapterGroupType } from "@/db/selects";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import TooltipWrapper from "../TooltipWrapper";
import { useState } from "react";
import DeleteChapterGroupDialog from "./DeleteChapterGroupDialog";

interface Props {
  chaptersGroup: ChapterGroupType;
  deleteCG: (id: string) => void;
}

const ChapterGroupActions = ({ chaptersGroup, deleteCG }: Props) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DeleteChapterGroupDialog
        deleteCG={deleteCG}
        chaptersGroupId={chaptersGroup.id}
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center justify-center">
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

export default ChapterGroupActions;
