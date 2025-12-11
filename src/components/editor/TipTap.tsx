"use client";

import { useEditor, EditorContent, useEditorState } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import ToolBar from "./ToolBar";
import { useEffect, useState } from "react";
import BottomBar from "./BottomBar";
import Link from "@tiptap/extension-link";
import { ChapterType } from "@/db/selects";
import { getChapterById } from "@/lib/actions/chapters";

interface Props {
  chapterId: string;
}

const TipTap = ({ chapterId }: Props) => {
  const [wordCount, setWordCount] = useState(4);
  const [chapter, setChapter] = useState<ChapterType | null>(null);

  useEffect(() => {
    const getData = async () => {
      const res = await getChapterById(chapterId);

      if (res.success) {
        setChapter(
          res.data
            ? {
                ...res.data,
                visits: res.data.visits ?? 0,
                publicDate: res.data.publicDate ?? undefined,
                lastUpdated: res.data.lastUpdated ?? new Date(),
                createdAt: res.data.createdAt ?? new Date(),
              }
            : null
        );
      }
    };

    getData();
  }, [chapterId]);

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
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        isAllowedUri: (url, ctx) => {
          try {
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }

            const disallowedProtocols = ["ftp", "file", "mailto"];
            const protocol = parsedUrl.protocol.replace(":", "");

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }

            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === "string" ? p : p.scheme
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }

            const disallowedDomains = [
              "example-phishing.com",
              "malicious-site.net",
            ];
            const domain = parsedUrl.hostname;

            if (disallowedDomains.includes(domain)) {
              return false;
            }

            return true;
          } catch {
            return false;
          }
        },
        shouldAutoLink: (url) => {
          try {
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`https://${url}`);

            const disallowedDomains = [
              "example-no-autolink.com",
              "another-no-autolink.com",
            ];
            const domain = parsedUrl.hostname;

            return !disallowedDomains.includes(domain);
          } catch {
            return false;
          }
        },
      }),
      Image,
    ],
    content: "<p>Start writing something here...</p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[1000px] bg-white rounded-sm mx-auto p-5 px-10 focus:outline-1 focus:outline-none z-0 text-black shadow-custom",
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText().trim();
      const words = text ? text.split(/\s+/).length : 0;
      setWordCount(words);
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
        isParagraph: ctx.editor?.isActive("paragraph"),
        isOrderedList: ctx.editor?.isActive("orderedList"),
        isBulletList: ctx.editor?.isActive("bulletList"),
        isLink: ctx.editor?.isActive("link"),
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

      if (editor?.state.selection.empty) {
        editor
          ?.chain()
          .focus()
          .insertContent({
            type: "text",
            text: url,
            marks: [{ type: "link", attrs: { href: url } }],
          })
          .run();
      } else {
        editor?.chain().focus().setLink({ href: url }).run();
      }
    },
    saveContent: () => {
      const content = editor?.getJSON();
      console.log(content);
    },
  };

  return (
    <>
      <ToolBar commands={commands} editorState={editorState} />
      <main className="relative">
        <EditorContent editor={editor} className="" />
      </main>
      <BottomBar nWords={wordCount} />
    </>
  );
};

export default TipTap;
