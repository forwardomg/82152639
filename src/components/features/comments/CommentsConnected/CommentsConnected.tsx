import { useComments } from '@hooks/useComments';
import { CommentForm } from '@features/comments/CommentForm';
import { Comments } from '@features/comments/Comments';
import { Title } from '@components/ui/Title';
import { UI_TEXT } from '@constants/ui';
import styles from './CommentsConnected.module.css';

export function CommentsConnected() {
  const { comments, totalCount, addComment, updateComment, deleteComment, loading } = useComments();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Title.H1>{UI_TEXT.COMMENT_LIST.TITLES.COMMENTS}</Title.H1>
        <div className={styles.counter}>
          {UI_TEXT.COMMENT_LIST.STATUS.COMMENT_COUNT(totalCount)}
        </div>
      </header>

      <section className={styles.newCommentSection}>
        <Title.H2>{UI_TEXT.COMMENT_LIST.TITLES.ADD_COMMENT}</Title.H2>
        <CommentForm onSubmit={addComment} />
      </section>

      <section className={styles.commentsSection}>
        {loading ? (
          <div className={styles.loading}>{UI_TEXT.COMMENT_LIST.STATUS.LOADING}</div>
        ) : (
          <Comments
            comments={comments}
            onReply={addComment}
            onEdit={updateComment}
            onDelete={deleteComment}
          />
        )}
      </section>
    </div>
  );
}
