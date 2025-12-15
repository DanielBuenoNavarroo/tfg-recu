"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ChapterType } from "@/db/selects";
import { cn } from "@/lib/utils";

interface Props {
  chapter: ChapterType;
  fontFamily: string;
  fontSize: number;
}

const ChapterReader = ({ chapter, fontFamily, fontSize }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: chapter?.content
      ? JSON.parse(chapter.content)
      : "<p>Loading...</p>",
    editable: false,
    immediatelyRender: false,
  });

  return (
    <div
      className={cn(`prose max-w-none mt-8 reader-content`, fontFamily)}
      style={{ fontSize: `${fontSize}px` }}
    >
      {editor && <EditorContent editor={editor} />}
    </div>
  );
};

export default ChapterReader;
