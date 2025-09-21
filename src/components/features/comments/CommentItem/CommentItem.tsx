import { useState } from 'react';
import cn from 'classnames';
import { getRelativeTime } from '@utils/dateFormat';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { UI_TEXT } from '@constants/ui';
import { STORAGE_KEYS } from '@constants/storage';
import { Button } from '@ui/Button';
import { CommentForm } from '../CommentForm';
import { CommentErrorBoundary } from '../CommentErrorBoundary';
import type { CommentWithChildren, CommentFormData } from '@services/comments';
import styles from './CommentItem.module.css';

interface CommentItemProps {
  comment: CommentWithChildren;
  onReply: (data: CommentFormData, parentId: string) => Promise<void>;
  onEdit: (id: string, data: Partial<CommentFormData>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  maxDepth?: number;
}

export function CommentItem({
  comment,
  onReply,
  onEdit,
  onDelete,
  maxDepth = 4,
}: CommentItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [savedAuthor] = useLocalStorage<string>(STORAGE_KEYS.AUTHOR_NAME, '');

  const isDeleted =
    comment.author === UI_TEXT.COMMENT_ITEM.STATUS.DELETED &&
    comment.text === UI_TEXT.COMMENT_ITEM.STATUS.DELETED;
  const isOwnComment = savedAuthor === comment.author && !isDeleted;
  const canReply = comment.depth < maxDepth - 1;

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggleCollapse();
    }
  };

  const handleReply = async (data: CommentFormData) => {
    await onReply(data, comment.id);
    setShowReplyForm(false);
  };

  const handleEdit = async (data: CommentFormData) => {
    await onEdit(comment.id, data);
    setShowEditForm(false);
  };

  const handleDelete = async () => {
    if (window.confirm(UI_TEXT.COMMENT_ITEM.ACTIONS.CONFIRM_DELETE)) {
      setIsDeleting(true);
      try {
        await onDelete(comment.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
  };

  return (
    <article
      className={styles.container}
      aria-label={UI_TEXT.COMMENT_ITEM.ARIA_LABELS.COMMENT_BY(comment.author)}
      role="article"
    >
      <div
        className={styles.comment}
        style={{
          paddingLeft: `${Math.min(comment.depth * 24, 96)}px`,
        }}
      >
        {comment.depth > 0 && (
          <>
            <div
              className={cn(styles.threadLine, styles.threadLineVertical)}
              onClick={handleToggleCollapse}
              style={{
                left: `${comment.depth * 24 - 16}px`,
              }}
            />
            <div
              className={cn(styles.threadLine, styles.threadLineHorizontal)}
              onClick={handleToggleCollapse}
              style={{
                left: `${comment.depth * 24 - 16}px`,
              }}
            />
          </>
        )}
        <header className={styles.header}>
          <button
            onClick={handleToggleCollapse}
            onKeyDown={handleKeyDown}
            className={styles.collapseButton}
            aria-label={
              isCollapsed
                ? UI_TEXT.COMMENT_ITEM.ARIA_LABELS.EXPAND_THREAD_WITH_REPLIES(
                    comment.childCount || 0
                  )
                : UI_TEXT.COMMENT_ITEM.ARIA_LABELS.COLLAPSE_THREAD
            }
            aria-expanded={!isCollapsed}
            type="button"
          >
            {isCollapsed
              ? UI_TEXT.COMMENT_ITEM.SYMBOLS.EXPAND
              : UI_TEXT.COMMENT_ITEM.SYMBOLS.COLLAPSE}
          </button>
          <span
            className={cn(styles.author, { [styles.deletedAuthor]: isDeleted })}
            aria-label={
              isDeleted
                ? UI_TEXT.COMMENT_ITEM.ARIA_LABELS.DELETED_USER
                : UI_TEXT.COMMENT_ITEM.ARIA_LABELS.AUTHOR(comment.author)
            }
          >
            {comment.author}
          </span>
          <span>{UI_TEXT.COMMENT_ITEM.SYMBOLS.SEPARATOR}</span>
          <time
            className={styles.timestamp}
            dateTime={new Date(comment.createdAt).toISOString()}
            aria-label={UI_TEXT.COMMENT_ITEM.ARIA_LABELS.POSTED_TIME(
              getRelativeTime(comment.createdAt),
              !!comment.editedAt
            )}
          >
            {getRelativeTime(comment.createdAt)}
            {comment.editedAt && ` ${UI_TEXT.COMMENT_ITEM.STATUS.EDITED}`}
          </time>
          {isCollapsed && comment.childCount ? (
            <span className={styles.childCount}>
              {UI_TEXT.COMMENT_ITEM.STATUS.CHILDREN_COUNT(comment.childCount)}
            </span>
          ) : null}
        </header>

        {!isCollapsed && (
          <>
            {showEditForm ? (
              <div className={styles.editForm}>
                <CommentForm
                  onSubmit={handleEdit}
                  onCancel={handleCancelEdit}
                  initialText={comment.text}
                  submitLabel={UI_TEXT.COMMENT_FORM.BUTTONS.SAVE}
                  showCancel
                  autoFocus
                />
              </div>
            ) : (
              <div
                className={cn(styles.text, { [styles.deletedText]: isDeleted })}
                aria-label={
                  isDeleted
                    ? UI_TEXT.COMMENT_ITEM.ARIA_LABELS.DELETED_COMMENT
                    : UI_TEXT.COMMENT_ITEM.ARIA_LABELS.COMMENT_TEXT
                }
              >
                {comment.text}
              </div>
            )}

            {!showEditForm && !isDeleted && (
              <nav
                className={styles.actions}
                aria-label={UI_TEXT.COMMENT_ITEM.ARIA_LABELS.COMMENT_ACTIONS}
              >
                {canReply && (
                  <Button
                    variant="link"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    aria-label={UI_TEXT.COMMENT_ITEM.ARIA_LABELS.REPLY_TO(comment.author)}
                    aria-pressed={showReplyForm}
                  >
                    {UI_TEXT.COMMENT_ITEM.ACTIONS.REPLY}
                  </Button>
                )}
                {isOwnComment && (
                  <>
                    <Button
                      variant="link"
                      onClick={() => setShowEditForm(true)}
                      aria-label={UI_TEXT.COMMENT_ITEM.ARIA_LABELS.EDIT_YOUR_COMMENT}
                    >
                      {UI_TEXT.COMMENT_ITEM.ACTIONS.EDIT}
                    </Button>
                    <Button
                      variant="link"
                      danger
                      onClick={handleDelete}
                      disabled={isDeleting}
                      aria-label={UI_TEXT.COMMENT_ITEM.ARIA_LABELS.DELETE_YOUR_COMMENT}
                      aria-busy={isDeleting}
                    >
                      {isDeleting
                        ? UI_TEXT.COMMENT_ITEM.ACTIONS.DELETING
                        : UI_TEXT.COMMENT_ITEM.ACTIONS.DELETE}
                    </Button>
                  </>
                )}
              </nav>
            )}

            {showReplyForm && (
              <div className={styles.replyForm}>
                <CommentForm
                  onSubmit={handleReply}
                  onCancel={handleCancelReply}
                  placeholder={UI_TEXT.COMMENT_FORM.PLACEHOLDERS.REPLY(comment.author)}
                  submitLabel={UI_TEXT.COMMENT_FORM.BUTTONS.REPLY}
                  showCancel
                  autoFocus
                />
              </div>
            )}
          </>
        )}
      </div>

      {!isCollapsed && comment.children && comment.children.length > 0 && (
        <section
          className={styles.children}
          role="group"
          aria-label={UI_TEXT.COMMENT_ITEM.ARIA_LABELS.REPLIES_TO(
            comment.children.length,
            comment.author
          )}
        >
          {comment.children.length > 1 && (
            <div
              className={cn(styles.threadLine, styles.childrenThreadLine)}
              onClick={handleToggleCollapse}
              style={{
                left: `${(comment.depth + 1) * 24 - 16}px`,
              }}
            />
          )}
          {comment.children.map((child) => (
            <CommentErrorBoundary key={child.id} commentId={child.id}>
              <CommentItem
                comment={child}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                maxDepth={maxDepth}
              />
            </CommentErrorBoundary>
          ))}
        </section>
      )}
    </article>
  );
}
