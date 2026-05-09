import { Star } from 'lucide-react';
import { cn } from '../utils/cn';

interface RatingStarsProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function RatingStars({ label, value, onChange }: RatingStarsProps) {
  return (
    <div className="rounded-card border border-border/80 bg-white p-4">
      <p className="mb-3 text-sm font-semibold text-text-primary">{label}</p>
      <div className="flex items-center gap-2">
        {Array.from({ length: 5 }, (_, index) => {
          const current = index + 1;

          return (
            <button
              key={current}
              type="button"
              aria-label={`${current} estrela${current > 1 ? 's' : ''}`}
              onClick={() => onChange(current)}
              className="rounded-full p-1 transition hover:scale-105"
            >
              <Star
                className={cn(
                  'h-7 w-7 transition',
                  current <= value ? 'fill-warning text-warning' : 'text-slate-300'
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
