import cn from 'classnames';
import styles from './TextArea.module.css';

interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  variant?: 'default';
  error?: boolean;
  ref?: React.Ref<HTMLTextAreaElement>;
}

export function TextArea({ variant = 'default', error, ref, ...props }: TextAreaProps) {
  return (
    <textarea
      ref={ref}
      className={cn(styles.textarea, styles[variant], { [styles.textareaError]: error })}
      aria-invalid={error}
      aria-required={props.required}
      {...props}
    />
  );
}
