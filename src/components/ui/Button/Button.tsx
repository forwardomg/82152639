import type { ButtonHTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'link';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  danger?: boolean;
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  danger = false,
  loading = false,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const classNames = cn(styles.button, styles[variant], danger && styles.danger);

  return (
    <button className={classNames} disabled={disabled || loading} {...rest}>
      {children}
    </button>
  );
}
