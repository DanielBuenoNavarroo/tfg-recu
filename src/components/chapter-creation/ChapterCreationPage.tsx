"use client";

import { ChapterGroupType, ChapterType } from "@/db/selects";
import { useEffect, useMemo, useState } from "react";
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
  getBookData,
  updateChapter,
  updateChapterGroup,
} from "@/lib/actions/chapters";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { handleAction } from "@/lib/utils";
import ChaptersGroupContainer from "./ChaptersGroupContainer";
import { Button } from "../ui/button";
import { File, PlusIcon } from "lucide-react";
import { createPortal } from "react-dom";
import ChapterCard from "./ChapterCard";

interface Props {
  id: string;
}

export type UpdateCType = (
  id: string,
  data: Partial<{
    groupId: string | null;
    order: number;
    title: string;
    isPublic: boolean;
    publicDate?: Date;
  }>
) => void;

const ChapterCreationPage = ({ id: bookId }: Props) => {
  const [chaptersGroups, setChaptersGroups] = useState<ChapterGroupType[]>([]);
  const [activeChaptersGroup, setActiveChaptersGroup] =
    useState<ChapterGroupType | null>(null);
  const [chapters, setChapters] = useState<ChapterType[]>([]);
  const [activeChapter, setActiveChapter] = useState<ChapterType | null>(null);

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

    getData();
  }, [bookId]);

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
      () =>
        setChaptersGroups((prev) =>
          prev
            .filter((g) => g.id !== id)
            .sort((a, b) => a.order - b.order)
            .map((g, index) => ({
              ...g,
              order: index + 1,
            }))
        ),
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

  const updateC: UpdateCType = (id, data) =>
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
      () =>
        setChapters((prev) =>
          prev
            .filter((c) => c.id !== id)
            .sort((a, b) => a.order - b.order)
            .map((c, index) => ({
              ...c,
              order: index + 1,
            }))
        ),
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

  if (!chaptersGroups || chaptersGroups.length === 0) {
    return (
      <div className="flex flex-col gap-4 h-full items-center justify-center pt-10">
        <div className="flex flex-col text-center mb-16">
          <h1 className="text-3xl font-bold">Chapters</h1>
          <p className="text-slate-300">Manage your chapters</p>
        </div>
        <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
          <File size={40} className="stroke-slate-300" />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No chapters groups created yet</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first group
          </p>
        </div>
        <Button onClick={createNewChapterGroup}>
          <PlusIcon />
          Add New Group
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">Chapters</h1>
            <p className="text-slate-300">Manage your chapters</p>
          </div>
          <Button onClick={createNewChapterGroup}>
            <PlusIcon />
            Add New Group
          </Button>
        </div>
        <div className="mt-10 w-full flex flex-col gap-4">
          <SortableContext items={chaptersGroupId}>
            {chaptersGroups.map((cg) => (
              <ChaptersGroupContainer
                key={cg.id}
                chapters={chapters.filter((c) => c.groupId === cg.id)}
                chaptersGroup={cg}
                createC={createC}
                deleteC={deleteC}
                updateC={updateC}
                updateCG={updateCG}
                deleteCG={deleteCG}
              />
            ))}
          </SortableContext>
        </div>
        {typeof window !== "undefined" &&
          createPortal(
            <DragOverlay>
              {activeChaptersGroup && (
                <ChaptersGroupContainer
                  chapters={chapters.filter(
                    (c) => c.groupId === activeChaptersGroup.id
                  )}
                  chaptersGroup={activeChaptersGroup}
                  createC={createC}
                  deleteC={deleteC}
                  updateC={updateC}
                  updateCG={updateCG}
                  deleteCG={deleteCG}
                />
              )}
              {activeChapter && (
                <ChapterCard
                  chapter={activeChapter}
                  deleteC={deleteC}
                  updateC={updateC}
                />
              )}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </div>
  );
};

export default ChapterCreationPage;
