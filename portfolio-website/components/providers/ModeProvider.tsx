'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Mode } from '@/content/site';
import { ScrollTrigger, EASE_QUART, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/motion';
import { useLenis } from './SmoothScroll';
import { MODE_STORAGE_KEY as STORAGE_KEY } from '@/lib/boot';

/** Same values as the CSS tokens; the transition paints the *next* side. */
const WIPE: Record<Mode, { bg: string; fg: string; accent: string }> = {
  professional: { bg: 'rgb(238 236 231)', fg: 'rgb(17 17 17)', accent: 'rgb(255 72 22)' },
  personal: { bg: 'rgb(11 11 12)', fg: 'rgb(240 236 226)', accent: 'rgb(200 255 46)' },
};

/** How long the cover takes to close before the switch is committed underneath it. */
const COVER_MS = 620;
const SLICES = 8;

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
      lenis?.stop();
      setWipe({ to: next, x: origin?.x ?? window.innerWidth / 2, y: origin?.y ?? 0 });
      window.setTimeout(() => {
        commit(next);
        // Let the new tree mount and measure before revealing it.
        window.setTimeout(() => setWipe(null), 320);
      }, COVER_MS);
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

  return (
    <ModeContext.Provider value={{ mode, switching: !!wipe, setMode, toggle }}>
      {children}
      <AnimatePresence
        onExitComplete={() => {
          lenis?.start();
          ScrollTrigger.refresh();
        }}
      >
        {wipe &&
          (wipe.to === 'personal' ? (
            // Tape stop: the suite tears into slices and glitches into the board.
            <motion.div
              key="tape"
              aria-hidden
              className="pointer-events-none fixed inset-0 z-[90] flex flex-col"
              exit={{ opacity: 0, transition: { duration: 0.35, ease: 'linear' } }}
            >
              {Array.from({ length: SLICES }, (_, i) => (
                <motion.div
                  key={i}
                  className="flex-1"
                  style={{ background: WIPE.personal.bg, transformOrigin: i % 2 ? 'right' : 'left' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.42, ease: EASE_QUART, delay: i * 0.025 }}
                />
              ))}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: [0, -14, 9, -4, 0] }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <span className="poster relative text-poster-lg" style={{ color: WIPE.personal.fg }}>
                  <span className="absolute inset-0 translate-x-[6px]" style={{ color: WIPE.personal.accent }}>
                    After hours
                  </span>
                  <span className="relative mix-blend-difference">After hours</span>
                </span>
              </motion.div>
            </motion.div>
          ) : (
            // Boot: a CRT line powers on and opens into the clean edit suite.
            <motion.div
              key="boot"
              aria-hidden
              className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center"
              style={{ background: WIPE.professional.bg, color: WIPE.professional.fg }}
              initial={{ clipPath: 'inset(50% 50% 50% 50%)' }}
              animate={{ clipPath: ['inset(50% 50% 50% 50%)', 'inset(49.8% 0% 49.8% 0%)', 'inset(0% 0% 0% 0%)'] }}
              exit={{ opacity: 0, transition: { duration: 0.35, ease: 'linear' } }}
              transition={{ duration: 0.6, times: [0, 0.45, 1], ease: EASE_QUART }}
            >
              <motion.span
                className="tc flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.2 }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: WIPE.professional.accent }} />
                Edit suite · 00:00:00:00
              </motion.span>
            </motion.div>
          ))}
      </AnimatePresence>
    </ModeContext.Provider>
  );
}
