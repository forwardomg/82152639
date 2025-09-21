import type { ReactNode } from 'react';
import styles from './FormField.module.css';

interface FormFieldProps {
  label?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}

export function FormField({ label, error, htmlFor, children }: FormFieldProps) {
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={htmlFor} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>{children}</div>
      {error && (
        <div id={`${htmlFor}-error`} className={styles.error} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
