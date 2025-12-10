import { ReviewWithUserType } from "@/db/selects";
import { deleteReview, voteReview } from "@/lib/actions/reviews";
import { useState } from "react";
import { toast } from "sonner";

export function useReviewVotes(initialReviews: ReviewWithUserType[] | null) {
  const [reviews, setReviews] = useState<ReviewWithUserType[] | null>(
    initialReviews
  );

  const handleVote = async (reviewId: string, isLike: boolean) => {
    const res = await voteReview({ isLike, reviewId });
    if (res.success) {
      setReviews((prev) =>
        prev
          ? prev.map((review) => {
              if (review.id !== reviewId) return review;

              let thumbsUp = review.thumbsUp;
              let thumbsDown = review.thumbsDown;

              if (review.currentUserVote === null) {
                if (isLike) thumbsUp++;
                else thumbsDown++;
              } else if (review.currentUserVote === 1 && !isLike) {
                thumbsUp--;
                thumbsDown++;
              } else if (review.currentUserVote === 0 && isLike) {
                thumbsDown--;
                thumbsUp++;
              }

              return {
                ...review,
                thumbsUp,
                thumbsDown,
                currentUserVote: isLike ? 1 : 0,
              };
            })
          : prev
      );
    }
  };

  const getReviewAverage = () => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return total / reviews.length;
  };

  const removeReview = async (reviewId: string) => {
    const res = await deleteReview(reviewId);
    if (res.success) {
      setReviews((prev) =>
        prev ? prev.filter((r) => r.id !== reviewId) : prev
      );
      toast.success("Review deleted correctly");
    }
  };

  const likeReview = (reviewId: string) => handleVote(reviewId, true);
  const dislikeReview = (reviewId: string) => handleVote(reviewId, false);

  return {
    reviews,
    setReviews,
    likeReview,
    dislikeReview,
    getReviewAverage,
    removeReview,
  };
}
