import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
  rightSlot?: ReactNode;
}

export default function Input({ label, error, icon, rightSlot, className, id, ...props }: InputProps) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-text-primary" htmlFor={id}>
      <span>{label}</span>
      <div
        className={cn(
          'flex min-h-[52px] items-center gap-3 rounded-input border bg-white px-4 transition duration-200',
          error ? 'border-danger/60 focus-within:border-danger' : 'border-border focus-within:border-primary/60'
        )}
      >
        {icon ? <span className="text-text-secondary">{icon}</span> : null}
        <input
          id={id}
          className={cn(
            'min-w-0 w-full border-0 bg-transparent text-sm text-text-primary placeholder:text-text-secondary/70',
            className
          )}
          {...props}
        />
        {rightSlot ? <span className="shrink-0 text-text-secondary">{rightSlot}</span> : null}
      </div>
      {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
    </label>
  );
}
