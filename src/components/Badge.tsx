import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

const badgeClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary-light text-primary',
  success: 'bg-emerald-50 text-success',
  warning: 'bg-amber-50 text-warning',
  danger: 'bg-red-50 text-danger',
  neutral: 'bg-slate-100 text-text-secondary'
};

export default function Badge({ children, variant = 'neutral' }: BadgeProps) {
  return (
    <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold', badgeClasses[variant])}>
      {children}
    </span>
  );
}
