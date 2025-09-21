import { useLiveQuery } from 'dexie-react-hooks';
import { db, commentsService, buildCommentTree } from '@services/comments';
import type { Comment, CommentFormData } from '@services/comments';

export function useComments() {
  const comments = useLiveQuery(() => db.comments.toArray()) ?? [];
  const commentTree = buildCommentTree(comments);

  const addComment = async (data: CommentFormData, parentId: string | null = null) => {
    const newComment: Omit<Comment, 'id'> = {
      text: data.text,
      author: data.author,
      createdAt: new Date(),
      parentId,
    };

    await commentsService.create(newComment);
  };

  const updateComment = async (id: string, data: Partial<CommentFormData>) => {
    await commentsService.update(id, data);
  };

  const deleteComment = async (id: string) => {
    await commentsService.delete(id);
  };

  return {
    comments: commentTree,
    totalCount: comments.length,
    addComment,
    updateComment,
    deleteComment,
    loading: comments === undefined,
  };
}
