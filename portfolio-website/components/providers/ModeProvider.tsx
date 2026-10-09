'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { modeCopy, type Mode } from '@/content/site';
import { ScrollTrigger, EASE_QUART, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/motion';
import { useLenis } from './SmoothScroll';
import { MODE_STORAGE_KEY as STORAGE_KEY } from '@/lib/boot';

/** Same values as the CSS tokens; the wipe paints the *next* mode's background. */
const WIPE: Record<Mode, { bg: string; fg: string; accent: string }> = {
  professional: { bg: 'rgb(236 233 226)', fg: 'rgb(14 14 14)', accent: 'rgb(255 74 28)' },
  personal: { bg: 'rgb(10 10 11)', fg: 'rgb(236 232 223)', accent: 'rgb(200 255 46)' },
};

type Ctx = {
  mode: Mode;
  switching: boolean;
  setMode: (next: Mode, origin?: { x: number; y: number }) => void;
  toggle: (origin?: { x: number; y: number }) => void;
};

const ModeContext = createContext<Ctx | null>(null);

export const useMode = () => {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used inside <ModeProvider>');
  return ctx;
};

export default function ModeProvider({ children }: { children: React.ReactNode }) {
  const lenis = useLenis();
  const [mode, setModeState] = useState<Mode>('professional');
  const [wipe, setWipe] = useState<{ to: Mode; x: number; y: number } | null>(null);
  const pending = useRef<Mode | null>(null);

  // Pick up what the boot script decided before hydration finished painting.
  useIsoLayoutEffect(() => {
    const initial = document.documentElement.dataset.mode;
    if (initial === 'personal' || initial === 'professional') setModeState(initial);
  }, []);

  const commit = useCallback(
    (next: Mode) => {
      document.documentElement.dataset.mode = next;
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {}
      const url = new URL(window.location.href);
      if (next === 'personal') url.searchParams.set('mode', 'personal');
      else url.searchParams.delete('mode');
      window.history.replaceState(window.history.state, '', url.toString());
      setModeState(next);
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    },
    [lenis]
  );

  const setMode = useCallback(
    (next: Mode, origin?: { x: number; y: number }) => {
      if (next === mode || wipe) return;
      if (prefersReducedMotion()) {
        commit(next);
        requestAnimationFrame(() => ScrollTrigger.refresh());
        return;
      }
      pending.current = next;
      lenis?.stop();
      setWipe({
        to: next,
        x: origin?.x ?? window.innerWidth / 2,
        y: origin?.y ?? 0,
      });
    },
    [mode, wipe, commit, lenis]
  );

  const toggle = useCallback(
    (origin?: { x: number; y: number }) => setMode(mode === 'professional' ? 'personal' : 'professional', origin),
    [mode, setMode]
  );

  // Keyboard shortcut: press "M" to flip modes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key.toLowerCase() === 'm' && !e.metaKey && !e.ctrlKey && !e.altKey) toggle();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle]);

  const radius = wipe
    ? Math.hypot(Math.max(wipe.x, window.innerWidth - wipe.x), Math.max(wipe.y, window.innerHeight - wipe.y))
    : 0;

  return (
    <ModeContext.Provider value={{ mode, switching: !!wipe, setMode, toggle }}>
      {children}
      <AnimatePresence
        onExitComplete={() => {
          lenis?.start();
          ScrollTrigger.refresh();
        }}
      >
        {wipe && (
          <motion.div
            key={wipe.to}
            aria-hidden
            className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden"
            style={{ background: WIPE[wipe.to].bg, color: WIPE[wipe.to].fg }}
            initial={{ clipPath: `circle(0px at ${wipe.x}px ${wipe.y}px)` }}
            animate={{ clipPath: `circle(${radius + 20}px at ${wipe.x}px ${wipe.y}px)` }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.85, ease: EASE_QUART }}
            onAnimationComplete={() => {
              if (pending.current) {
                const next = pending.current;
                pending.current = null;
                commit(next);
                // Let the new tree mount and measure before revealing it.
                window.setTimeout(() => setWipe(null), 380);
              }
            }}
          >
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE_QUART, delay: 0.15 }}
            >
              <span className="label" style={{ color: WIPE[wipe.to].accent }}>
                Switching to
              </span>
              <span className="display text-huge">{modeCopy[wipe.to].label}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModeContext.Provider>
  );
}
