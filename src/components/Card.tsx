import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface CardButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const baseClassName =
  'rounded-card border border-border/80 bg-surface p-4 text-left shadow-card transition duration-200';

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={cn(baseClassName, className)} {...props}>
      {children}
    </div>
  );
}

export function CardButton({ children, className, type = 'button', ...props }: CardButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        baseClassName,
        'w-full hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft active:translate-y-0',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
