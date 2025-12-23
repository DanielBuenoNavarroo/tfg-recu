"use client";

import Link from "next/link";
import ChapterReader from "./ChapterReader";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Book, CommentDto, CommentNode, User } from "@/types";
import { ChapterGroupType, ChapterType } from "@/db/selects";
import { getBookById, getSimilarBooks } from "@/lib/actions/book";
import { getBookData, getChapterById } from "@/lib/actions/chapters";
import { ArrowUp, ChevronLeft, Cog, Minus, Plus, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { buildCommentTree, cn, getInitials } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Session } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Separator } from "../ui/separator";
import PrevChapterButton from "./PrevChapterButton";
import NextChapterButton from "./NextChapterBtn";
import BookList from "../BookList";
import { getCommentsByChapterId } from "@/lib/actions/comments";
import CommentsSection from "./CommentSection";
import { hasUserPurchasedBook } from "@/lib/actions/purchases";
import { redirect } from "next/navigation";

const ReadPage = ({
  bookId,
  chapterId,
  session,
}: {
  bookId: string;
  chapterId: string;
  session: Session;
}) => {
  const storageKey = `reader-preferences-${session.user.id}`;

  const [book, setBook] = useState<Book>();
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [chapter, setChapter] = useState<ChapterType>();
  const [author, setAuthor] = useState<User>();
  const [fontFamily, setFontFamily] = useState<string>("font-inter");
  const [fontSize, setFontSize] = useState(18);
  const [chaptersGroups, setChaptersGroups] = useState<ChapterGroupType[]>([]);
  const [chapters, setChapters] = useState<ChapterType[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [comments, setComments] = useState<CommentNode[]>([]);

  useEffect(() => {
    const getItems = () => {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const prefs = JSON.parse(saved);
          setFontFamily(prefs.fontFamily ?? "font-inter");
          setFontSize(prefs.fontSize ?? 18);
        } catch (err) {
          console.error("Error parsing preferences:", err);
        }
      }
    };

    getItems();
  }, [storageKey]);

  useEffect(() => {
    const data = async () => {
      if (book && book?.price === 0) {
        return;
      }
      const res = await hasUserPurchasedBook(bookId);

      if (res.success) {
        if (!res.data) {
          redirect(`/book/${bookId}/chapters`);
        }
      }
    };
    data();
  }, [book, bookId]);

  useEffect(() => {
    const prefs = { fontFamily, fontSize };
    localStorage.setItem(storageKey, JSON.stringify(prefs));
  }, [fontFamily, fontSize, storageKey]);

  useEffect(() => {
    const getData = async () => {
      const b = await getBookById(bookId);
      const c = await getChapterById(chapterId);

      if (b.succes) {
        setBook(b.data as unknown as Book);
        setAuthor(b.data?.author as unknown as User);
      }

      if (c.success) {
        setChapter(c.data as unknown as ChapterType);
      }
    };

    getData();
  }, [bookId, chapterId]);

  useEffect(() => {
    const getData = async () => {
      const res = await getBookData(bookId);
      if (res.success) {
        setChapters(
          (res.data?.chaps ?? []).map((c) => ({
            ...c,
            title: c.title ?? "",
            visits: c.visits ?? 0,
            lastUpdated: c.lastUpdated ?? new Date(),
            createdAt: c.createdAt ?? new Date(),
            publicDate: c.publicDate ?? undefined,
          }))
        );
        setChaptersGroups(
          (res.data?.groups ?? []).map((g) => ({
            ...g,
            order: g.order ?? 0,
            createdAt: g.createdAt ?? new Date(),
          }))
        );
      } else {
        console.log("Error al traer los datos de los libros");
      }
    };

    const getSimilarBooksData = async () => {
      const res = await getSimilarBooks(bookId);

      if (res.succes) {
        setSimilarBooks(res.data as unknown as Book[]);
      }
    };

    getData();
    getSimilarBooksData();
  }, [bookId]);

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await getCommentsByChapterId(chapterId);

        if (!res.success || !res.data) {
          return;
        }

        const tree = buildCommentTree(res.data as unknown as CommentDto[]);
        setComments(tree);
      } catch (e) {
        console.error(e);
      }
    };

    getComments();
  }, [chapterId]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative max-w-5xl mx-auto pb-16">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="fixed right-10 bottom-10">
            <Cog size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[400]">
          <DialogHeader>
            <DialogTitle>Reader preferences</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-4 w-full mt-4">
            <p className="w-32">Font family</p>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="font-inter">Inter</SelectItem>
                <SelectItem value="font-merriweather">Merriweather</SelectItem>
                <SelectItem value="font-crimson">Crimson Text</SelectItem>
                <SelectItem value="font-ibm">IBM Plex Sans</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 w-full mt-4">
            <p className="w-32">Font size</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setFontSize((prev) => Math.max(12, prev - 1))}
              >
                <Minus size={16} />
              </Button>
              <span className="w-12 text-center">{fontSize}px</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setFontSize((prev) => Math.min(36, prev + 1))}
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {isVisible && (
        <Button
          variant="outline"
          className="fixed bottom-20 right-10 rounded-full shadow-lg"
          onClick={scrollToTop}
        >
          <ArrowUp size={20} />
        </Button>
      )}
      <div className="flex items-center justify-between">
        <Button asChild variant={"outline"} className="bg-slate-900!">
          <Link
            href={`/books/${bookId}/chapters`}
            className="flex items-center justify-center"
          >
            <ChevronLeft />
            {book?.title}
            <p className="mx-0.5 text-xl">·</p>
            <p>Chapter list</p>
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <PrevChapterButton
            bookId={bookId}
            chapters={chapters}
            chaptersGroups={chaptersGroups}
            chapter={chapter}
            className="bg-slate-900!"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} className="bg-slate-900!">
                {chapter?.order}-{chapter?.title}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {chaptersGroups
                .sort((a, b) => a.order - b.order)
                .map((group) => (
                  <DropdownMenuGroup key={group.id} className="max-h-80">
                    <DropdownMenuLabel className="text-sm font-semibold">
                      <p className="text-base select-none">{group.name}</p>
                    </DropdownMenuLabel>
                    {chapters
                      .filter((c) => c.groupId === group.id)
                      .sort((a, b) => a.order - b.order)
                      .map((c) => (
                        <DropdownMenuItem
                          key={c.id}
                          asChild
                          className={cn(
                            "truncate-1-lines",
                            chapter && chapter.id === c.id && "bg-slate-900!"
                          )}
                        >
                          <Link href={`/books/${bookId}/chapters/${c.id}`}>
                            {c.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuGroup>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <NextChapterButton
            bookId={bookId}
            chapters={chapters}
            chaptersGroups={chaptersGroups}
            chapter={chapter}
            className="bg-slate-900!"
          />
        </div>
      </div>
      <h1 className="text-3xl font-bold mt-8">{chapter?.title}</h1>
      <div className="flex items-center mt-4">
        <Avatar className="size-10">
          <AvatarFallback>
            {author?.fullName ? (
              getInitials(author.fullName || "IN")
            ) : (
              <UserIcon />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="flex pl-3 text-sm flex-col">
          <p className="text-base">{author?.fullName}</p>
          <p className="text-slate-400">
            {chapter && chapter.publicDate
              ? new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(chapter.publicDate))
              : ""}
          </p>
        </div>
      </div>
      {/* chapter content */}
      {chapter ? (
        <ChapterReader
          chapter={chapter}
          fontFamily={fontFamily}
          fontSize={fontSize}
        />
      ) : (
        "No data to show"
      )}
      <div className="flex items-center justify-between mt-8">
        <PrevChapterButton
          bookId={bookId}
          chapters={chapters}
          chaptersGroups={chaptersGroups}
          chapter={chapter}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="bg-slate-900!">
              {chapter?.order}-{chapter?.title}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {chaptersGroups
              .sort((a, b) => a.order - b.order)
              .map((group) => (
                <DropdownMenuGroup key={group.id} className="max-h-80">
                  <DropdownMenuLabel className="text-sm font-semibold">
                    <p className="text-base select-none">{group.name}</p>
                  </DropdownMenuLabel>
                  {chapters
                    .filter((c) => c.groupId === group.id)
                    .sort((a, b) => a.order - b.order)
                    .map((c) => (
                      <DropdownMenuItem
                        key={c.id}
                        asChild
                        className={cn(
                          "truncate-1-lines",
                          chapter && chapter.id === c.id && "bg-slate-950!"
                        )}
                      >
                        <Link href={`/books/${bookId}/chapters/${c.id}`}>
                          {c.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <NextChapterButton
          bookId={bookId}
          chapters={chapters}
          chaptersGroups={chaptersGroups}
          chapter={chapter}
        />
      </div>
      <Separator className="my-8" />
      <BookList
        title="Similar books"
        books={similarBooks}
        containerClassName="mt-10"
      />
      <Separator className="my-8" />
      <CommentsSection
        comments={comments}
        setComments={setComments}
        chapterId={chapterId}
        userId={session.user.id}
      />
    </div>
  );
};

export default ReadPage;
