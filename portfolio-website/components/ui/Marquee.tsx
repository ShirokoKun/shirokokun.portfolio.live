'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/motion';
import { useLenis } from '@/components/providers/SmoothScroll';

/**
 * Infinite marquee whose speed and direction follow scroll velocity, the way a
 * film strip lurches when you scrub it.
 */
export default function Marquee({
  items,
  className = '',
  speed = 60,
  separator = '✦',
}: {
  items: string[];
  className?: string;
  speed?: number;
  separator?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    let x = 0;
    let dir = -1;
    let boost = 0;
    const half = () => el.scrollWidth / 2;

    const tick = (_t: number, dt: number) => {
      const v = lenis?.velocity ?? 0;
      if (Math.abs(v) > 0.5) dir = v > 0 ? -1 : 1;
      boost += (Math.min(Math.abs(v) * 0.9, 18) - boost) * 0.1;
      x += dir * (speed + boost * 40) * (dt / 1000);
      const w = half();
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      gsap.set(el, { x, skewX: dir * -boost * 0.35 });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [lenis, speed]);

  const row = (
    <div className="flex shrink-0 items-center">
      {[...items, ...items].map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-[0.35em]">{item}</span>
          <span className="px-[0.35em] text-accent">{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-label={items.join(', ')}>
      <div ref={track} className="flex w-max will-change-transform" aria-hidden>
        {row}
        {row}
      </div>
    </div>
  );
}
