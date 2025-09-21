import { useEffect, useRef, useState, useActionState } from 'react';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { useUnsavedChanges } from '@hooks/useUnsavedChanges';
import { UI_TEXT } from '@constants/ui';
import { VALIDATION } from '@constants/validation';
import { STORAGE_KEYS } from '@constants/storage';
import { Button } from '@ui/Button';
import { FormField } from '@ui/FormField';
import { Input } from '@ui/Input';
import { TextArea } from '@ui/TextArea';
import type { CommentFormData } from '@services/comments';
import styles from './CommentForm.module.css';

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => Promise<void>;
  onCancel?: () => void;
  initialText?: string;
  placeholder?: string;
  submitLabel?: string;
  showCancel?: boolean;
  autoFocus?: boolean;
}

interface FormState {
  error: string | null;
  success: boolean;
}

export function CommentForm({
  onSubmit,
  onCancel,
  initialText = '',
  placeholder = UI_TEXT.COMMENT_FORM.PLACEHOLDERS.DEFAULT,
  submitLabel = UI_TEXT.COMMENT_FORM.BUTTONS.POST,
  showCancel = false,
  autoFocus = false,
}: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [savedAuthor, setSavedAuthor] = useLocalStorage<string>(STORAGE_KEYS.AUTHOR_NAME, '');
  const [isDirty, setIsDirty] = useState(false);

  useUnsavedChanges(isDirty, UI_TEXT.COMMENT_FORM.WARNINGS.UNSAVED_CHANGES);

  const submitAction = async (_: FormState, formData: FormData): Promise<FormState> => {
    const text = formData.get('text') as string;
    const author = formData.get('author') as string;

    if (
      !text.trim() ||
      text.length < VALIDATION.COMMENT.MIN_LENGTH ||
      text.length > VALIDATION.COMMENT.MAX_LENGTH
    ) {
      return { error: VALIDATION.COMMENT.MESSAGES.LENGTH, success: false };
    }

    if (!author.trim()) {
      return { error: VALIDATION.COMMENT.MESSAGES.AUTHOR_REQUIRED, success: false };
    }

    try {
      setSavedAuthor(author);

      await onSubmit({ text: text.trim(), author: author.trim() });

      if (formRef.current) {
        formRef.current.reset();
        setIsDirty(false);
      }

      return { error: null, success: true };
    } catch (error) {
      console.error('Submit error:', error);
      return { error: VALIDATION.COMMENT.MESSAGES.SUBMIT_ERROR, success: false };
    }
  };

  const [state, formAction, isPending] = useActionState(submitAction, {
    error: null,
    success: false,
  });

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }
  };

  const handleCancel = () => {
    if (formRef.current) {
      formRef.current.reset();
      setIsDirty(false);
    }
    onCancel?.();
  };

  const handleFormChange = () => {
    setIsDirty(true);
  };

  return (
    <form
      ref={formRef}
      action={formAction}
      className={styles.form}
      onChange={handleFormChange}
      aria-label={UI_TEXT.COMMENT_FORM.ARIA_LABELS.FORM}
    >
      <FormField label={UI_TEXT.COMMENT_FORM.LABELS.NAME} htmlFor="author">
        <Input
          type="text"
          id="author"
          name="author"
          defaultValue={savedAuthor}
          placeholder={UI_TEXT.COMMENT_FORM.PLACEHOLDERS.AUTHOR_NAME}
          required
          disabled={isPending}
          aria-describedby={state.error ? 'form-error' : undefined}
        />
      </FormField>

      <FormField label={UI_TEXT.COMMENT_FORM.LABELS.COMMENT} htmlFor="text">
        <TextArea
          ref={textareaRef}
          id="text"
          name="text"
          defaultValue={initialText}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={4}
          required
          disabled={isPending}
          minLength={VALIDATION.COMMENT.MIN_LENGTH}
          maxLength={VALIDATION.COMMENT.MAX_LENGTH}
          aria-label={UI_TEXT.COMMENT_FORM.ARIA_LABELS.COMMENT_WITH_SHORTCUT(
            UI_TEXT.COMMENT_FORM.LABELS.COMMENT
          )}
          aria-describedby={state.error ? 'form-error' : undefined}
        />
      </FormField>

      {state.error && (
        <div id="form-error" className={styles.error} role="alert" aria-live="polite">
          {state.error}
        </div>
      )}

      <div className={styles.actions}>
        <Button
          type="submit"
          variant="primary"
          disabled={isPending}
          loading={isPending}
          aria-busy={isPending}
        >
          {isPending ? UI_TEXT.COMMENT_FORM.BUTTONS.SUBMITTING : submitLabel}
        </Button>
        {showCancel && (
          <Button type="button" variant="secondary" onClick={handleCancel} disabled={isPending}>
            {UI_TEXT.COMMENT_FORM.BUTTONS.CANCEL}
          </Button>
        )}
      </div>
    </form>
  );
}
