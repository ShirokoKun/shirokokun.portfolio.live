'use client';

import { motion } from 'framer-motion';
import { MODES, modeCopy } from '@/content/site';
import { useMode } from '@/components/providers/ModeProvider';

/** The Professional / Personal switch. Press "M" anywhere for the same thing. */
export default function ModeToggle({ className = '', size = 'md' }: { className?: string; size?: 'md' | 'lg' }) {
  const { mode, setMode } = useMode();
  const pad = size === 'lg' ? 'px-5 py-3' : 'px-3.5 py-2';

  return (
    <div
      role="radiogroup"
      aria-label="Choose which side of the portfolio to see"
      className={`relative inline-flex items-center rounded-full border border-line/20 bg-bg/70 p-1 backdrop-blur-md ${className}`}
    >
      {MODES.map((m) => {
        const active = m === mode;
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={(e) => setMode(m, { x: e.clientX, y: e.clientY })}
            className={`label relative z-10 rounded-full ${pad} transition-colors duration-500 ${
              active ? 'text-accent-ink' : 'text-fg/70 hover:text-fg'
            }`}
          >
            {active && (
              <motion.span
                layoutId={`mode-thumb-${size}`}
                className="absolute inset-0 -z-10 rounded-full bg-accent"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            {modeCopy[m].label}
          </button>
        );
      })}
    </div>
  );
}
