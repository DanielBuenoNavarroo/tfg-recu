"use client";

import { HexColorInput, HexColorPicker } from "react-colorful";
import BookCover from "./BookCover";

interface Props {
  value?: string;
  url?: string | undefined;
  onPickerChange: (color: string) => void;
}

const ColorPicker = ({ onPickerChange, value, url }: Props) => {
  return (
    <div className="relative flex justify-between">
      <div className="">
        <div className="flex flex-row items-center mb-2">
          <p>#</p>
          <HexColorInput
            color={value}
            onChange={onPickerChange}
            className="outline-none"
          />
        </div>
        <HexColorPicker color={value} onChange={onPickerChange} />
      </div>
      <div className="hidden sm:block">
        <BookCover
          coverColor={value ? value : "#314158"}
          coverUrl={url && url.trim() !== "" ? url : undefined}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
