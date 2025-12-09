"use client";

import { useState } from "react";
import DeleteBookDialog from "./DeleteBookDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import TooltipWrapper from "./TooltipWrapper";
import { Book } from "@/types";

const OwnedBookCard = (book: Book) => {
  
  
  return <div>OwnedBookCard</div>;
};

export default OwnedBookCard;
