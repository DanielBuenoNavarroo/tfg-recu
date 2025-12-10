"use client";

import { ChapterGroupType, ChapterType } from "@/db/selects";
import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  createChapter,
  createChapterGroup,
  deleteChapter,
  deleteChapterGroup,
  updateChapter,
  updateChapterGroup,
} from "@/lib/actions/chapters";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { handleAction } from "@/lib/utils";

interface Props {
  id: string;
}

const ChapterCreationPage = ({ id: bookId }: Props) => {
  const [chaptersGroups, setChaptersGroups] = useState<ChapterGroupType[]>([]);
  const [activeChaptersGroup, setActiveChaptersGroup] =
    useState<ChapterGroupType | null>(null);
  const [chapters, setChapters] = useState<ChapterType[]>([]);
  const [activeChapter, setActiveChapter] = useState<ChapterType | null>(null);

  const chaptersGroupId = useMemo(
    () => chaptersGroups.map((cg) => cg.id),
    [chaptersGroups]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const createNewChapterGroup = () =>
    handleAction(
      () =>
        createChapterGroup({
          bookId,
          name: `Season ${chaptersGroups.length + 1}`,
        }),
      (data) => setChaptersGroups((prev) => [...prev, data]),
      "Group created successfully",
      "Failed to create group"
    );

  const deleteCG = (id: string) =>
    handleAction(
      () => deleteChapterGroup(id),
      (data) => setChaptersGroups((prev) => prev.filter((g) => g.id !== id)),
      "Group deleted successfully",
      "Failed to delete group"
    );

  const updateCG = (
    id: string,
    data: Partial<{ name: string; order: number }>
  ) =>
    handleAction(
      () => updateChapterGroup(id, data),
      (newData) =>
        setChaptersGroups((prev) =>
          prev.map((g) => (g.id === newData.id ? newData : g))
        ),
      "Group updated successfully",
      "Failed to update group"
    );

  const createC = (payload: {
    groupId?: string | null;
    order: number;
    title: string;
    content: string;
  }) =>
    handleAction(
      () =>
        createChapter({
          bookId,
          ...payload,
        }),
      (data) => setChapters((prev) => [...prev, data]),
      "Chapter created successfully",
      "Failed to create chapter"
    );

  const updateC = (
    id: string,
    data: Partial<{ groupId: string | null; order: number; title: string }>
  ) =>
    handleAction(
      () => updateChapter(id, data),
      (newData) =>
        setChapters((prev) =>
          prev.map((c) => (c.id === newData.id ? newData : c))
        ),
      "Chapter updated successfully",
      "Failed to update chapter"
    );

  const deleteC = (id: string) =>
    handleAction(
      () => deleteChapter(id),
      () => setChapters((prev) => prev.filter((c) => c.id !== id)),
      "Chapter deleted successfully",
      "Failed to delete chapter"
    );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveChaptersGroup(event.active.data.current?.chaptersGroup);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveChapter(event.active.data.current?.chapter);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveChaptersGroup(null);
    setActiveChapter(null);

    const { active, over } = event;
    if (!over) return;

    const activeChaptersGroupId = active.id;
    const overChaptersGroupId = over.id;

    if (activeChaptersGroupId === overChaptersGroupId) return;

    setChaptersGroups((cg) => {
      const activeChaptersGroupIdnex = cg.findIndex(
        (c) => c.id === activeChaptersGroupId
      );
      const overChaptersGroupIdnex = cg.findIndex(
        (c) => c.id === overChaptersGroupId
      );

      return arrayMove(cg, activeChaptersGroupIdnex, overChaptersGroupIdnex);
    });
  };

  const onDragOver = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const isActiveAChapter = active.data.current?.type === "Chapter";
    const isOverAChapter = over.data.current?.type === "Chapter";
    const isOverAChaptersGroup = over.data.current?.type === "ChaptersGroup";

    if (activeId === overId) return;
    if (!isActiveAChapter) return;

    if (isActiveAChapter && isOverAChapter) {
      setChapters((chapters) => {
        const activeIndex = chapters.findIndex((ch) => ch.id === activeId);
        const overIndex = chapters.findIndex((ch) => ch.id === overId);

        chapters[activeIndex].groupId = chapters[overIndex].groupId;

        return arrayMove(chapters, activeIndex, overIndex);
      });
    }

    if (isActiveAChapter && isOverAChaptersGroup) {
      setChapters((chapters) => {
        const activeIndex = chapters.findIndex((ch) => ch.id === activeId);

        chapters[activeIndex].groupId = overId;

        return arrayMove(chapters, activeIndex, activeIndex);
      });
    }
  };

  return <div>ChapterCreationPage</div>;
};

export default ChapterCreationPage;
