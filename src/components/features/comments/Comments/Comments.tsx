import { CommentItem } from '../CommentItem';
import { CommentErrorBoundary } from '../CommentErrorBoundary';
import { UI_TEXT } from '@constants/ui';
import type { CommentWithChildren, CommentFormData } from '@services/comments';
import styles from './Comments.module.css';

export interface CommentsProps {
  comments: CommentWithChildren[];
  onReply: (data: CommentFormData, parentId: string) => Promise<void>;
  onEdit: (id: string, data: Partial<CommentFormData>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function Comments({ comments, onReply, onEdit, onDelete }: CommentsProps) {
  if (comments.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{UI_TEXT.COMMENT_LIST.STATUS.EMPTY}</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {comments.map((comment) => (
        <CommentErrorBoundary key={comment.id} commentId={comment.id}>
          <CommentItem comment={comment} onReply={onReply} onEdit={onEdit} onDelete={onDelete} />
        </CommentErrorBoundary>
      ))}
    </div>
  );
}
