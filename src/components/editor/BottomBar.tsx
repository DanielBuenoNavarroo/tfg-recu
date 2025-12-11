import React from "react";

const BottomBar = ({ nWords }: { nWords: number }) => {
  return (
    <div className="fixed z-20 w-full bg-white bottom-0 left-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-1 px-3">
      <p className="text-black/80 text-xs">{nWords} words</p>
    </div>
  );
};

export default BottomBar;
