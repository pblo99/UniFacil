import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Modal({ open, title, onClose, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute inset-0 z-50 flex items-end justify-center bg-slate-950/28 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:items-center md:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-md flex-col overflow-hidden rounded-[28px] bg-white p-5 shadow-2xl md:max-h-[calc(100dvh-4rem)]"
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 flex shrink-0 items-start justify-between gap-3">
              <h2 className="break-words text-lg font-semibold text-text-primary">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-text-secondary transition hover:bg-slate-100 hover:text-text-primary"
                aria-label="Fechar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 space-y-4 overflow-y-auto pr-1">{children}</div>
            {footer ? <div className="mt-5 flex shrink-0 flex-col gap-3">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
