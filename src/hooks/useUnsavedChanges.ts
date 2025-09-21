import { useEffect } from 'react';
import { UI_TEXT } from '@constants/ui';

export function useUnsavedChanges(hasUnsavedChanges: boolean, message?: string) {
  useEffect(() => {
    const warningMessage = message || UI_TEXT.COMMENT_FORM.WARNINGS.UNSAVED_CHANGES;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = warningMessage;
        return warningMessage;
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, message]);
}
