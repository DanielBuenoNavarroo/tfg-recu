import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ChapterGroupType, ChapterType } from "@/db/selects";

export default function NextChapterButton({
  bookId,
  chapter,
  chapters,
  chaptersGroups,
  className,
}: {
  bookId: string;
  chapter?: ChapterType;
  chapters: ChapterType[];
  chaptersGroups: ChapterGroupType[];
  className?: string;
}) {
  if (!chapter) {
    return (
      <Button variant="outline" disabled>
        <ChevronRight />
      </Button>
    );
  }

  const sortedGroups = [...chaptersGroups].sort((a, b) => a.order - b.order);
  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

  const currentGroupIndex = sortedGroups.findIndex(
    (g) => g.id === chapter.groupId
  );

  const currentGroupChapters = sortedChapters.filter(
    (c) => c.groupId === chapter.groupId
  );

  const currentIndex = currentGroupChapters.findIndex(
    (c) => c.id === chapter.id
  );

  let nextChapter: ChapterType | undefined;

  if (currentIndex !== -1 && currentIndex < currentGroupChapters.length - 1) {
    nextChapter = currentGroupChapters[currentIndex + 1];
  }

  if (
    !nextChapter &&
    currentGroupIndex !== -1 &&
    currentGroupIndex < sortedGroups.length - 1
  ) {
    const nextGroup = sortedGroups[currentGroupIndex + 1];
    const nextGroupChapters = sortedChapters.filter(
      (c) => c.groupId === nextGroup.id
    );
    if (nextGroupChapters.length > 0) {
      nextChapter = nextGroupChapters[0];
    }
  }

  return nextChapter ? (
    <Button asChild variant="outline" className={className}>
      <Link href={`/books/${bookId}/chapters/${nextChapter.id}`}>
        <ChevronRight />
      </Link>
    </Button>
  ) : (
    <Button variant="outline" disabled>
      <ChevronRight />
    </Button>
  );
}
