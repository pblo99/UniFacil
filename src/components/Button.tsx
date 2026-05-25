import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white shadow-soft hover:bg-primary-dark',
  secondary: 'bg-primary-light text-primary hover:bg-primary-light/80',
  ghost: 'bg-transparent text-text-secondary hover:bg-slate-100',
  outline: 'border border-border bg-white text-text-primary hover:border-primary/30 hover:text-primary',
  danger: 'bg-danger text-white hover:bg-danger/90'
};

export default function Button({
  children,
  className,
  fullWidth = false,
  type = 'button',
  variant = 'primary',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex min-h-[52px] items-center justify-center gap-2 rounded-button px-4 text-sm font-semibold transition duration-200',
        'whitespace-normal text-center focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
