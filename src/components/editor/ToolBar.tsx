/* eslint-disable jsx-a11y/alt-text */
import {
  Bold,
  ChevronsLeftRight,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Pilcrow,
  Underline,
} from "lucide-react";
import { Button, ButtonVariant } from "../ui/button";
import { cn } from "@/lib/utils";

interface Props {
  commands: {
    toggleBold: () => boolean | undefined;
    toggleItalic: () => boolean | undefined;
    toggleUnderline: () => boolean | undefined;
    toggleCodeBlock: () => boolean | undefined;
    toggleH1: () => boolean | undefined;
    toggleH2: () => boolean | undefined;
    toggleH3: () => boolean | undefined;
    toggleParagraph: () => boolean | undefined;
    toggleOrderedList: () => boolean | undefined;
    toggleBulletList: () => boolean | undefined;
    addImage: () => void;
    addLink: () => void;
  };
  editorState: {
    isBold: boolean | undefined;
    isItalic: boolean | undefined;
    isUnderline: boolean | undefined;
    isCodeBlock: boolean | undefined;
    isH1: boolean | undefined;
    isH2: boolean | undefined;
    isH3: boolean | undefined;
    isParagraph: boolean | undefined;
    isOrderedList: boolean | undefined;
    isBulletList: boolean | undefined;
    isLink: boolean | undefined;
  } | null;
}

const BTN_VARIANT: ButtonVariant = "ghost";

const ToolBar = ({ commands, editorState }: Props) => {
  return (
    <nav className="bg-white w-full fixed top-0 left-0 z-10 flex justify-between p-2 shadow-custom">
      <div className="">
        <Button
          variant={BTN_VARIANT}
          onClick={commands.toggleBold}
          className={cn("editor-btns", editorState?.isBold && "bg-blue-200!")}
        >
          <Bold />
        </Button>
        <Button
          variant={BTN_VARIANT}
          onClick={commands.toggleItalic}
          className={cn("editor-btns", editorState?.isItalic && "bg-blue-200!")}
        >
          <Italic />
        </Button>
        <Button
          variant={BTN_VARIANT}
          onClick={commands.toggleUnderline}
          className={cn(
            "editor-btns",
            editorState?.isUnderline && "bg-blue-200!"
          )}
        >
          <Underline />
        </Button>
        <Button
          variant={BTN_VARIANT}
          onClick={commands.toggleCodeBlock}
          className={cn(
            "editor-btns",
            editorState?.isCodeBlock && "bg-blue-200!"
          )}
        >
          <ChevronsLeftRight />
        </Button>
        <Button
          variant={BTN_VARIANT}
          onClick={commands.toggleH1}
          className={cn("editor-btns", editorState?.isH1 && "bg-blue-200!")}
        >
          <Heading1 />
        </Button>
        <Button
          variant={BTN_VARIANT}
          onClick={commands.toggleH2}
          className={cn("editor-btns", editorState?.isH2 && "bg-blue-200!")}
        >
          <Heading2 />
        </Button>
        <Button
          variant={BTN_VARIANT}
          onClick={commands.toggleH3}
          className={cn("editor-btns", editorState?.isH3 && "bg-blue-200!")}
        >
          <Heading3 />
        </Button>
        <Button
          variant={BTN_VARIANT}
          onClick={commands.toggleParagraph}
          className={cn(
            "editor-btns",
            editorState?.isParagraph && "bg-blue-200!"
          )}
        >
          <Pilcrow />
        </Button>
        <Button
          variant={BTN_VARIANT}
          onClick={commands.toggleOrderedList}
          className={cn(
            "editor-btns",
            editorState?.isOrderedList && "bg-blue-200!"
          )}
        >
          <ListOrdered />
        </Button>
        <Button
          variant={BTN_VARIANT}
          onClick={commands.toggleBulletList}
          className={cn(
            "editor-btns",
            editorState?.isBulletList && "bg-blue-200!"
          )}
        >
          <List />
        </Button>
        <Button
          variant={BTN_VARIANT}
          onClick={commands.addImage}
          className={cn("editor-btns")}
        >
          <Image />
        </Button>
        <Button
          variant={BTN_VARIANT}
          onClick={commands.addLink}
          className={cn("editor-btns", editorState?.isLink && "bg-blue-200!")}
        >
          <Link />
        </Button>
      </div>
    </nav>
  );
};

export default ToolBar;
