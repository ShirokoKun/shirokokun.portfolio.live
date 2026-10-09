'use client';

import { createElement, useRef } from 'react';
import { gsap, SplitText, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/motion';

type Props = {
  as?: keyof JSX.IntrinsicElements;
  id?: string;
  by?: 'lines' | 'words' | 'chars';
  className?: string;
  delay?: number;
  stagger?: number;
  /** Reveal on scroll (default) or immediately on mount. */
  onScroll?: boolean;
  /** Wait for a custom event (e.g. the preloader finishing) before playing. */
  waitFor?: string;
  children: React.ReactNode;
};

/**
 * Masked text reveal powered by GSAP SplitText. Lines or words slide up from
 * behind a clip, like a title card. Children should be plain text.
 */
export default function Reveal({
  as = 'div',
  id,
  by = 'lines',
  className,
  delay = 0,
  stagger,
  onScroll = true,
  waitFor,
  children,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let split: SplitText | null = null;
    let cleanupWait: (() => void) | undefined;
    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: by === 'chars' ? 'words,chars' : by,
        mask: by === 'chars' ? 'words' : by,
        linesClass: 'split-line',
      });
      const targets = by === 'lines' ? split.lines : by === 'words' ? split.words : split.chars;
      gsap.set(targets, { yPercent: 115, rotate: by === 'chars' ? 0 : 2 });

      const play = () =>
        gsap.to(targets, {
          yPercent: 0,
          rotate: 0,
          duration: by === 'chars' ? 1 : 1.2,
          stagger: stagger ?? (by === 'lines' ? 0.08 : by === 'words' ? 0.04 : 0.02),
          delay,
          ease: 'expo.out',
          scrollTrigger: onScroll && !waitFor ? { trigger: el, start: 'top 88%', once: true } : undefined,
        });

      if (waitFor && !(window as unknown as Record<string, boolean>)[waitFor]) {
        const handler = () => play();
        window.addEventListener(waitFor, handler, { once: true });
        cleanupWait = () => window.removeEventListener(waitFor, handler);
      } else {
        play();
      }
    }, el);

    return () => {
      cleanupWait?.();
      ctx.revert();
      split?.revert();
    };
  }, [by, delay, stagger, onScroll, waitFor]);

  return createElement(as, { ref, id, className }, children);
}
