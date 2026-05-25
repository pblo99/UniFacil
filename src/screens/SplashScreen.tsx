import { motion } from 'framer-motion';
import Button from '../components/Button';
import { AppIcon } from '../utils/icons';
import logo from '../assets/logo.svg';

interface SplashScreenProps {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: SplashScreenProps) {
  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-6 py-10 text-center">
      <div className="absolute left-6 top-16 rounded-full bg-white/80 p-4 text-primary shadow-card">
        <AppIcon icon="book-open" className="h-6 w-6" />
      </div>
      <div className="absolute right-8 top-24 rounded-full bg-primary-light p-4 text-primary shadow-card">
        <AppIcon icon="calendar" className="h-6 w-6" />
      </div>
      <div className="absolute bottom-28 left-10 rounded-full bg-white/80 p-4 text-primary shadow-card">
        <AppIcon icon="messages" className="h-6 w-6" />
      </div>
      <div className="absolute bottom-20 right-8 rounded-full bg-primary-light p-4 text-primary shadow-card">
        <AppIcon icon="folder" className="h-6 w-6" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm"
      >
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[30px] bg-white shadow-soft">
          <img src={logo} alt="Logo UniFácil" className="h-20 w-20" />
        </div>
        <h1 className="mt-8 text-[2.5rem] font-semibold tracking-tight text-text-primary">UniFácil</h1>
        <p className="mx-auto mt-4 max-w-xs text-base leading-7 text-text-secondary">
          Sua vida acadêmica em um só lugar.
        </p>
      </motion.div>
      <div className="mt-12 w-full max-w-sm">
        <Button fullWidth onClick={onStart}>
          Começar
        </Button>
      </div>
    </div>
  );
}
