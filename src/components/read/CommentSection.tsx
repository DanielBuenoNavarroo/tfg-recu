"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CommentList } from "./CommentList";
import { CommentNode } from "@/types";
import { Send } from "lucide-react";
import { createComment, deleteComment } from "@/lib/actions/comments";
import { toast } from "sonner";
import { insertCommentIntoTree, removeCommentFromTree } from "@/lib/utils";

export default function CommentsSection({
  comments,
  setComments,
  chapterId,
  userId,
}: {
  comments: CommentNode[];
  setComments: Dispatch<SetStateAction<CommentNode[]>>;
  chapterId: string;
  userId: string;
}) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const res = await createComment({ content: newComment, chapterId });

    if (res.success && res.data) {
      setComments((prev) => insertCommentIntoTree(prev, res.data));
      setNewComment("");
    } else {
      toast.error("Failed to post comment");
    }

    setNewComment("");
  };

  const handleDelete = async (id: string) => {
    const res = await deleteComment(id);

    if (res.success) {
      setComments((prev) => removeCommentFromTree(prev, id));
      toast.success("Comment removed successfully");
    } else {
      toast.error("Failed to post comment");
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    try {
      const res = await createComment({
        content,
        chapterId,
        parentCommentId: parentId,
      });

      if (res.success && res.data) {
        setComments((prev) => insertCommentIntoTree(prev, res.data));
        toast.success("Respuesta publicada");
      } else {
        toast.error("Failed to post reply");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error posting reply");
    }
  };

  return (
    <div className="">
      <h1 className="text-4xl mb-4">Comments</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
        <Input
          type="text"
          placeholder="Write a new comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant={"outline"}>
          <Send />
        </Button>
      </form>
      <CommentList
        comments={comments}
        userId={userId}
        handleDelete={handleDelete}
        handleReply={handleReply}
      />
    </div>
  );
}
