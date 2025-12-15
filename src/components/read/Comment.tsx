import { useState } from "react";
import { CommentList } from "./CommentList";
import { IconBtn } from "./IconBtn";
import { CommentNode } from "@/types";
import { Edit, Heart, Reply, Trash } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "long",
});

export function Comment({
  content,
  createdAt,
  userName,
  childComments,
  currentUserId,
  id,
  userId,
  handleDelete,
  handleReply,
}: CommentNode & {
  currentUserId: string;
  handleDelete: (id: string) => Promise<void>;
  handleReply: (parentId: string, content: string) => Promise<void>;
}) {
  const [areChildrenHidden, setAreChildrenHidden] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    await handleReply(id, replyContent);
    setReplyContent("");
    setIsReplying(false);
  };

  return (
    <>
      <div className="p-2 mt-4 border rounded-md">
        <div className="flex justify-between mb-1 text-sm text-slate-400">
          <span className="font-bold">{userName ?? "Deleted user"}</span>
          <span className="">
            {dateFormatter.format(Date.parse(createdAt))}
          </span>
        </div>

        <div className="message">{content}</div>

        <div className="flex gap-2 mt-2 justify-end">
          <IconBtn
            Icon={Reply}
            aria-label="Reply"
            onClick={() => setIsReplying(!isReplying)}
          />
          {userId === currentUserId && (
            <IconBtn
              Icon={Trash}
              aria-label="Delete"
              color="danger"
              onClick={() => handleDelete(id)}
            />
          )}
        </div>
        {isReplying && (
          <form onSubmit={submitReply} className="mt-2 flex gap-2">
            <Input
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="flex-1"
            />
            <Button type="submit">Reply</Button>
          </form>
        )}
      </div>

      {childComments.length > 0 && (
        <>
          <div className={`flex w-full ${areChildrenHidden ? "hide" : ""}`}>
            <button
              className="collapse-line"
              aria-label="Hide Replies"
              onClick={() => setAreChildrenHidden(true)}
            />
            <div className="pl-2 flex-1 w-full">
              <CommentList
                comments={childComments}
                userId={currentUserId}
                handleDelete={handleDelete}
                handleReply={handleReply}
              />
            </div>
          </div>

          <Button
            className={`${!areChildrenHidden ? "hide" : ""}`}
            variant={"link"}
            onClick={() => setAreChildrenHidden(false)}
          >
            Show Replies
          </Button>
        </>
      )}
    </>
  );
}
