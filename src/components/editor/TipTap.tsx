"use client";

import { useEditor, EditorContent, useEditorState } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import ToolBar from "./ToolBar";

const TipTap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: "text-black bg-gray-200 p-2 text-lg rounded-sm",
          },
        },
        link: {
          autolink: true,
          openOnClick: false,
        },
      }),
      Image,
    ],
    content: "<p>Hello World! 🌎️</p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "w-[90%] min-h-[1000px] bg-white rounded-sm mx-auto p-5 focus:outline-1 focus:outline-none z-0 text-black shadow-custom",
      },
    },
  });

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor?.isActive("bold"),
        isItalic: ctx.editor?.isActive("italic"),
        isUnderline: ctx.editor?.isActive("underline"),
        isCodeBlock: ctx.editor?.isActive("codeBlock"),
        isH1: ctx.editor?.isActive("heading", { level: 1 }),
        isH2: ctx.editor?.isActive("heading", { level: 2 }),
        isH3: ctx.editor?.isActive("heading", { level: 3 }),
        isParagraph: ctx.editor?.isActive('paragraph'),
        isOrderedList: ctx.editor?.isActive('orderedList'),
        isBulletList: ctx.editor?.isActive('bulletList'),
        isLink: ctx.editor?.isActive('link'),
      };
    },
  });

  const commands = {
    toggleBold: () => editor?.chain().focus().toggleBold().run(),
    toggleItalic: () => editor?.chain().focus().toggleItalic().run(),
    toggleUnderline: () => editor?.chain().focus().toggleUnderline().run(),
    toggleCodeBlock: () => editor?.chain().focus().toggleCodeBlock().run(),
    toggleH1: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    toggleH2: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    toggleH3: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
    toggleParagraph: () => editor?.chain().focus().setParagraph().run(),
    toggleOrderedList: () => editor?.chain().focus().toggleOrderedList().run(),
    toggleBulletList: () => editor?.chain().focus().toggleBulletList().run(),
    addImage: () => {
      const url = window.prompt("URL");

      if (!url) return;

      editor?.chain().focus().setImage({ src: url }).run();
    },
    addLink: () => {
      const lastUrl = editor?.getAttributes("link").href;
      const url = window.prompt("URL", lastUrl);

      if (!url) return;

      editor?.chain().focus().setLink({ href: url }).run();
    },
  };

  return (
    <>
      <ToolBar commands={commands} editorState={editorState} />
      <main className="">
        <EditorContent editor={editor} className="" />
      </main>
    </>
  );
};

export default TipTap;
