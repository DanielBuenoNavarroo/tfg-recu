import { Comment } from "./Comment";

export const CommentList = ({ comments }) => {
  return comments.map((comment) => (
    <div key={comment.id}>
      <Comment {...comment} />
    </div>
  ));
};
