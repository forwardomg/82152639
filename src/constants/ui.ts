export const UI_TEXT = {
  COMMENT_FORM: {
    PLACEHOLDERS: {
      DEFAULT: 'Write a comment...',
      REPLY: (author: string) => `Reply to ${author}...`,
      AUTHOR_NAME: 'Your name',
    },
    BUTTONS: {
      POST: 'Post comment',
      REPLY: 'Reply',
      SAVE: 'Save',
      CANCEL: 'Cancel',
      SUBMITTING: 'Submitting...',
    },
    LABELS: {
      NAME: 'Name',
      COMMENT: 'Comment',
    },
    WARNINGS: {
      UNSAVED_CHANGES: 'Changes you made may not be saved.',
    },
    ARIA_LABELS: {
      FORM: 'Comment form',
      COMMENT_WITH_SHORTCUT: (label: string) => `${label}. Press Cmd+Enter or Ctrl+Enter to submit`,
    },
  },
  COMMENT_ITEM: {
    ACTIONS: {
      REPLY: 'Reply',
      EDIT: 'Edit',
      DELETE: 'Delete',
      DELETING: 'Deleting...',
      EXPAND: 'Expand comment',
      COLLAPSE: 'Collapse comment',
      CONFIRM_DELETE: 'Are you sure you want to delete this comment?',
    },
    STATUS: {
      DELETED: '[deleted]',
      EDITED: '(edited)',
      CHILDREN_COUNT: (count: number) => `(${count} ${count === 1 ? 'child' : 'children'})`,
    },
    SYMBOLS: {
      EXPAND: '[+]',
      COLLAPSE: '[-]',
      SEPARATOR: '•',
    },
    ARIA_LABELS: {
      COMMENT_BY: (author: string) => `Comment by ${author}`,
      EXPAND_THREAD_WITH_REPLIES: (count: number) =>
        `Expand thread with ${count} ${count === 1 ? 'reply' : 'replies'}`,
      COLLAPSE_THREAD: 'Collapse thread',
      DELETED_USER: 'Deleted user',
      AUTHOR: (author: string) => `Author: ${author}`,
      POSTED_TIME: (time: string, edited: boolean) => `Posted ${time}${edited ? ', edited' : ''}`,
      DELETED_COMMENT: 'Deleted comment',
      COMMENT_TEXT: 'Comment text',
      COMMENT_ACTIONS: 'Comment actions',
      REPLY_TO: (author: string) => `Reply to ${author}'s comment`,
      EDIT_YOUR_COMMENT: 'Edit your comment',
      DELETE_YOUR_COMMENT: 'Delete your comment',
      REPLIES_TO: (count: number, author: string) =>
        `${count} ${count === 1 ? 'reply' : 'replies'} to ${author}`,
    },
  },
  COMMENT_LIST: {
    TITLES: {
      ADD_COMMENT: 'Add a comment',
      COMMENTS: 'Comments',
    },
    STATUS: {
      LOADING: 'Loading comments...',
      COMMENT_COUNT: (count: number) => `${count} ${count === 1 ? 'comment' : 'comments'}`,
      EMPTY: 'No comments yet. Be the first to share your thoughts!',
    },
  },
  ERROR_BOUNDARY: {
    MESSAGE: 'This comment could not be displayed',
    RETRY: 'Retry',
    GENERAL: {
      TITLE: 'Something went wrong',
      MESSAGE:
        "We encountered an unexpected error. The error has been logged and we'll look into it.",
      TRY_AGAIN: 'Try again',
      ERROR_DETAILS: 'Error details (development only)',
    },
  },
} as const;
