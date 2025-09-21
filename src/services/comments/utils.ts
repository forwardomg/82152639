import type { Comment, CommentWithChildren } from './types';

export function buildCommentTree(comments: Comment[], maxDepth = 4): CommentWithChildren[] {
  const commentMap = new Map<string, CommentWithChildren>();
  const rootComments: CommentWithChildren[] = [];

  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, children: [], depth: 0 });
  });

  comments.forEach((comment) => {
    const commentWithChildren = commentMap.get(comment.id);
    if (!commentWithChildren) return;

    if (!comment.parentId) {
      rootComments.push(commentWithChildren);
    } else {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        const parentDepth = getCommentDepth(parent, commentMap);
        if (parentDepth < maxDepth - 1) {
          parent.children.push(commentWithChildren);
          commentWithChildren.depth = parentDepth + 1;
        } else {
          rootComments.push(commentWithChildren);
        }
      } else {
        rootComments.push(commentWithChildren);
      }
    }
  });

  sortComments(rootComments);
  updateChildCounts(rootComments);

  return rootComments;
}

function getCommentDepth(
  comment: CommentWithChildren,
  commentMap: Map<string, CommentWithChildren>
): number {
  let depth = 0;
  let current = comment;

  while (current.parentId) {
    const parent = commentMap.get(current.parentId);
    if (!parent) break;
    depth++;
    current = parent;
  }

  return depth;
}

function sortComments(comments: CommentWithChildren[]) {
  comments.sort((a, b) => {
    if (a.depth === 0 && b.depth === 0) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  comments.forEach((comment) => {
    if (comment.children.length > 0) {
      sortComments(comment.children);
    }
  });
}

function updateChildCounts(comments: CommentWithChildren[]) {
  comments.forEach((comment) => {
    comment.childCount = countAllChildren(comment);
  });
}

export function countAllChildren(comment: CommentWithChildren): number {
  let count = comment.children.length;
  comment.children.forEach((child) => {
    count += countAllChildren(child);
  });
  return count;
}
