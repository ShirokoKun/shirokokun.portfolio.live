'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/motion';

/**
 * A dot that follows the pointer and grows into a labelled disc over anything
 * with `data-cursor="Label"`. Disabled on touch devices and for reduced motion.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [link, setLink] = useState(false);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    setEnabled(true);
    document.documentElement.classList.add('has-cursor');
    return () => document.documentElement.classList.remove('has-cursor');
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current) return;
    const el = dot.current;
    gsap.set(el, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });

    let hovering: string | null = null;
    let overLink = false;

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>('[data-cursor]');
      const next = labelled?.dataset.cursor || null;
      if (next !== hovering) {
        hovering = next;
        setLabel(next);
      }
      const link = !next && !!target?.closest('a, button, [role="button"], input, textarea, label, select');
      if (link !== overLink) {
        overLink = link;
        setLink(link);
      }
    };
    const onLeave = () => gsap.to(el, { opacity: 0, duration: 0.3 });
    const onEnter = () => gsap.to(el, { opacity: 1, duration: 0.3 });
    const onDown = () => gsap.to(el, { scale: 0.8, duration: 0.2 });
    const onUp = () => gsap.to(el, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dot}
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full text-accent-ink transition-[width,height,background-color] duration-500 ease-expo ${
        link && !label ? 'bg-accent/40' : 'bg-accent'
      }`}
      style={{ width: label ? 96 : link ? 44 : 12, height: label ? 96 : link ? 44 : 12 }}
    >
      <span
        className="label whitespace-nowrap text-[10px] transition-opacity duration-300"
        style={{ opacity: label ? 1 : 0 }}
      >
        {label}
      </span>
    </div>
  );
}
