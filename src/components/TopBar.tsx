import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  action?: ReactNode;
}

export default function TopBar({ title, subtitle, onBack, action }: TopBarProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-3 px-5 pb-4 pt-6">
      <div className="flex min-w-0 items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Voltar"
            className="rounded-full p-2 text-text-secondary transition hover:bg-slate-100 hover:text-text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : null}
        <div className="min-w-0">
          <h1 className="break-words text-[1.45rem] font-semibold leading-tight text-text-primary">{title}</h1>
          {subtitle ? <p className="mt-1 break-words text-sm text-text-secondary">{subtitle}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
