import type { ReactNode } from 'react';
import BottomNav from './BottomNav';
import type { AppScreen, MainScreen } from '../types/app';

interface AppShellProps {
  children: ReactNode;
  showBottomNav: boolean;
  currentScreen: AppScreen;
  onNavigate: (screen: MainScreen) => void;
}

export default function AppShell({ children, showBottomNav, currentScreen, onNavigate }: AppShellProps) {
  return (
    <div className="h-dvh min-h-dvh overflow-hidden px-0 md:px-6 md:py-6">
      <div className="mx-auto flex h-dvh w-full max-w-[460px] flex-col overflow-hidden bg-background md:h-[calc(100dvh-3rem)] md:rounded-frame md:border md:border-white/80 md:bg-white/80 md:shadow-card md:backdrop-blur">
        <div className="hidden shrink-0 justify-center pb-2 pt-3 md:flex">
          <div className="h-1.5 w-20 rounded-full bg-slate-200" />
        </div>
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
        {showBottomNav ? <BottomNav currentScreen={currentScreen} onNavigate={onNavigate} /> : null}
      </div>
    </div>
  );
}
