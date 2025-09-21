import type { HTMLAttributes, PropsWithChildren } from 'react';
import styles from './Title.module.css';
import cn from 'classnames';

type TitleProps = PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>;

export const Title = {
  H1: ({ children, className, ...props }: TitleProps) => (
    <h1 className={cn(styles.h1, className)} {...props}>
      {children}
    </h1>
  ),
  H2: ({ children, className, ...props }: TitleProps) => (
    <h2 className={cn(styles.h2, className)} {...props}>
      {children}
    </h2>
  ),
};
