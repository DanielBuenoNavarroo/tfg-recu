import { CommentDto, CommentNode } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const getFirstName = (name: string) => name.split(" ")[0];

export const minimize = (word: string) => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
};

export async function handleAction<T>(
  action: () => Promise<{ success: boolean; data?: T }>,
  onSuccess: (data: T) => void,
  successMessage: string,
  errorMessage: string
) {
  try {
    const res = await action();

    if (res.success && res.data) {
      toast.success(successMessage);
      onSuccess(res.data);
    } else {
      toast.error(errorMessage);
    }
  } catch (e) {
    console.error(e);
    toast.error(errorMessage);
  }
}

export function buildCommentTree(comments: CommentDto[]): CommentNode[] {
  const map = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  for (const comment of comments) {
    map.set(comment.id, {
      ...comment,
      childComments: [],
    });
  }

  for (const comment of map.values()) {
    if (comment.parentCommentId) {
      const parent = map.get(comment.parentCommentId);
      if (parent) {
        parent.childComments.push(comment);
      }
    } else {
      roots.push(comment);
    }
  }

  return roots;
}

export function insertCommentIntoTree(
  tree: CommentNode[],
  comment: CommentDto
): CommentNode[] {
  const newNode: CommentNode = {
    ...comment,
    childComments: [],
  };

  if (!comment.parentCommentId) {
    return [...tree, newNode];
  }

  const insertRecursively = (nodes: CommentNode[]): CommentNode[] => {
    return nodes.map((node) => {
      if (node.id === comment.parentCommentId) {
        return {
          ...node,
          childComments: [...node.childComments, newNode],
        };
      }

      return {
        ...node,
        childComments: insertRecursively(node.childComments),
      };
    });
  };

  return insertRecursively(tree);
}

export function removeCommentFromTree(
  comments: CommentNode[],
  id: string
): CommentNode[] {
  return comments
    .filter((c) => c.id !== id)
    .map((c) => ({
      ...c,
      childComments: removeCommentFromTree(c.childComments ?? [], id),
    }));
}
