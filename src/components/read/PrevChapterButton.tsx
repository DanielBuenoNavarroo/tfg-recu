import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ChapterGroupType, ChapterType } from "@/db/selects";

export default function PrevChapterButton({
  bookId,
  chapter,
  chapters,
  chaptersGroups,
}: {
  bookId: string;
  chapter?: ChapterType;
  chapters: ChapterType[];
  chaptersGroups: ChapterGroupType[];
}) {
  if (!chapter) {
    return (
      <Button variant="outline" disabled>
        <ChevronLeft />
      </Button>
    );
  }

  const sortedGroups = [...chaptersGroups].sort((a, b) => a.order - b.order);
  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

  const currentGroupIndex = sortedGroups.findIndex((g) => g.id === chapter.groupId);

  const currentGroupChapters = sortedChapters.filter(
    (c) => c.groupId === chapter.groupId
  );

  const currentIndex = currentGroupChapters.findIndex((c) => c.id === chapter.id);

  let prevChapter: ChapterType | undefined;

  if (currentIndex > 0) {
    prevChapter = currentGroupChapters[currentIndex - 1];
  }

  if (!prevChapter && currentGroupIndex > 0) {
    const prevGroup = sortedGroups[currentGroupIndex - 1];
    const prevGroupChapters = sortedChapters.filter((c) => c.groupId === prevGroup.id);
    if (prevGroupChapters.length > 0) {
      prevChapter = prevGroupChapters[prevGroupChapters.length - 1]; // último capítulo del grupo anterior
    }
  }

  return prevChapter ? (
    <Button asChild variant="outline">
      <Link href={`/books/${bookId}/chapters/${prevChapter.id}`}>
        <ChevronLeft />
      </Link>
    </Button>
  ) : (
    <Button variant="outline" disabled>
      <ChevronLeft />
    </Button>
  );
}