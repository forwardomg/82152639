export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  parentId: string | null;
  editedAt?: Date;
}

export interface CommentWithChildren extends Comment {
  children: CommentWithChildren[];
  depth: number;
  childCount?: number;
}

export interface CommentFormData {
  text: string;
  author: string;
}

export type CommentMode = 'new' | 'edit' | 'reply';

export interface CommentFormState {
  mode: CommentMode;
  commentId?: string;
  initialText?: string;
  initialAuthor?: string;
  onSubmit: (data: CommentFormData) => Promise<void>;
  onCancel: () => void;
}
