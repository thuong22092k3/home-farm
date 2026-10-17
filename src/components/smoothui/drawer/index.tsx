'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/* ------------------------------------------------------------------ */
/*  Animation constants                                                */
/* ------------------------------------------------------------------ */

const BACKDROP_DURATION = 0.2;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type DrawerSide = 'top' | 'right' | 'bottom' | 'left';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const SIDE_TO_CLASSES: Record<DrawerSide, string> = {
  top: 'inset-x-0 top-0 border-b',
  right: 'inset-y-0 right-0 border-l',
  bottom: 'inset-x-0 bottom-0 border-t',
  left: 'inset-y-0 left-0 border-r',
};

const SIDE_TO_POSITION: Record<DrawerSide, string> = {
  top: 'top-0 left-0 right-0',
  right: 'right-0 top-0 bottom-0',
  bottom: 'bottom-0 left-0 right-0',
  left: 'left-0 top-0 bottom-0',
};

export default function Drawer({ open, onClose, children, className }: DrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const shouldReduceMotion = useReducedMotion();

  // Handle escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : BACKDROP_DURATION }}
            className='fixed inset-0 z-50 bg-black/10'
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className={cn('fixed z-50 flex flex-col bg-popover p-4 shadow-lg', 'w-full max-w-md', 'inset-y-0 right-0', className)}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
