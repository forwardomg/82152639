export const VALIDATION = {
  COMMENT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000,
    MESSAGES: {
      LENGTH: 'Comment must be between 1 and 1000 characters',
      AUTHOR_REQUIRED: 'Author name is required',
      SUBMIT_ERROR: 'Failed to submit comment. Please try again.',
    },
  },
} as const;
