import { Home, Layers3, MessageCircleMore, MoreHorizontal, Users } from 'lucide-react';
import type { AppScreen, MainScreen } from '../types/app';
import { cn } from '../utils/cn';

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: MainScreen) => void;
}

const items: Array<{
  screen: MainScreen;
  label: string;
  icon: typeof Home;
}> = [
  { screen: 'home', label: 'Início', icon: Home },
  { screen: 'disciplines', label: 'Disciplinas', icon: Layers3 },
  { screen: 'groups', label: 'Grupos', icon: Users },
  { screen: 'chat', label: 'Chat', icon: MessageCircleMore },
  { screen: 'more', label: 'Mais', icon: MoreHorizontal }
];

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  return (
    <nav className="shrink-0 border-t border-border/80 bg-white/95 px-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      <ul className="grid grid-cols-5 gap-1">
        {items.map(({ screen, label, icon: Icon }) => {
          const isActive = currentScreen === screen;

          return (
            <li key={screen}>
              <button
                type="button"
                onClick={() => onNavigate(screen)}
                className={cn(
                  'flex min-h-[56px] w-full flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-semibold transition duration-200',
                  isActive ? 'bg-primary-light text-primary' : 'text-text-secondary hover:bg-slate-50'
                )}
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
