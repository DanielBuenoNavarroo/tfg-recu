import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { ChapterType } from "@/db/selects";
import { ChevronDownIcon, LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { UpdateCType } from "./ChapterCreationPage";
import { Input } from "../ui/input";

interface Props {
  chapter: ChapterType;
  updateC: UpdateCType;
}

const PublicChapterPicker = ({ chapter, updateC }: Props) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("12:00:00");
  const [open, setOpen] = useState(false);

  const combineDateTime = (date: Date, time: string): Date => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, seconds || 0);
    return combined;
  };

  const isInvalidDate = () => {
    if (!date) return true;
    const publishDate = combineDateTime(date, time);
    return publishDate < new Date();
  };

  const handleSave = () => {
    if (!date) return;
    const publishDate = combineDateTime(date, time);

    updateC(chapter.id, {
      isPublic: true,
      publicDate: publishDate,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {chapter.isPublic ? (
        <DropdownMenuItem
          className="flex items-center gap-2"
          onSelect={() => updateC(chapter.id, { isPublic: false })}
        >
          <LockKeyhole />
          Make Private
        </DropdownMenuItem>
      ) : (
        <DialogTrigger asChild onSelect={(e) => e.preventDefault()}>
          <DropdownMenuItem className="flex items-center gap-2">
            <LockKeyholeOpen />
            Make Public
          </DropdownMenuItem>
        </DialogTrigger>
      )}

      <DialogContent className="flex flex-col items-center gap-16 pt-16 min-h-[600px]">
        <DialogTitle className="text-4xl">Publish Chapter</DialogTitle>
        <div className="space-y-6 h-[300px] min-w-60">
          <div className="flex flex-col gap-4">
            <Label htmlFor="date" className="px-1 w-full">
              Set date of publication
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="justify-between font-normal"
                >
                  {date ? date.toLocaleDateString() : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="time-picker" className="px-1 w-full">
              Time
            </Label>
            <Input
              type="time"
              id="time-picker"
              step="1"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full! bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
            {isInvalidDate() && date && (
              <p className="text-red-500/90 text-xs">
                The date should be after this moment.
              </p>
            )}
          </div>
        </div>
        <Button
          variant={"outline"}
          className="w-full"
          disabled={isInvalidDate()}
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PublicChapterPicker;
