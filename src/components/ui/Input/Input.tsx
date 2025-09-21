import cn from 'classnames';
import styles from './Input.module.css';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  variant?: 'default';
  error?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

export function Input({ variant = 'default', error, ref, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      className={cn(styles.input, styles[variant], { [styles.inputError]: error })}
      aria-invalid={error}
      aria-required={props.required}
      {...props}
    />
  );
}
