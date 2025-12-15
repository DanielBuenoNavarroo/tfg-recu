import { CommentNode } from "@/types";
import { Comment } from "./Comment";

type Props = {
  comments: CommentNode[];
  userId: string;
  handleDelete: (id: string) => Promise<void>;
  handleReply: (parentId: string, content: string) => Promise<void>;
};

export function CommentList({ comments, userId, handleDelete, handleReply }: Props) {
  return (
    <>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          {...comment}
          currentUserId={userId}
          handleDelete={handleDelete}
          handleReply={handleReply}
        />
      ))}
    </>
  );
}
