'use client';

import { MODES, modeCopy } from '@/content/site';
import { useMode } from '@/components/providers/ModeProvider';

/** The Pro / After hours switch. Press "M" anywhere for the same thing. */
export default function ModeToggle({ className = '' }: { className?: string }) {
  const { mode, setMode } = useMode();
  const pro = mode === 'professional';

  return (
    <div
      role="radiogroup"
      aria-label="Choose which side of the portfolio to see"
      className={`relative inline-flex items-center border border-line/25 p-0.5 ${
        pro ? 'rounded-full' : 'rotate-[-1.5deg] rounded-none'
      } ${className}`}
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
            className={`${pro ? 'tc rounded-full' : 'tw'} relative h-8 whitespace-nowrap px-2.5 transition-colors sm:px-3 duration-300 ${
              active ? 'bg-accent text-accent-ink' : 'text-fg/75 hover:text-fg'
            }`}
          >
            {modeCopy[m].short}
          </button>
        );
      })}
    </div>
  );
}
