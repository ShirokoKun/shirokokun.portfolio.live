'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * Hard-cut montage: stacked frames that swap on a beat, with a running
 * timecode overlay. Feels like scrubbing an edit timeline.
 */
export default function FrameCycler({
  frames,
  interval = 650,
  className = '',
  sizes = '(max-width: 768px) 100vw, 60vw',
  overlay = true,
  priority = false,
}: {
  frames: string[];
  interval?: number;
  className?: string;
  sizes?: string;
  overlay?: boolean;
  priority?: boolean;
}) {
  const [index, setIndex] = useState(0);
  // Only cut between frames that have actually loaded, so slow images never flash grey.
  const [ready, setReady] = useState<string[]>([]);
  const live = frames.filter((f) => ready.includes(f));
  const current = live.length ? index % live.length : 0;
  const shown = live[current];
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const tc = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || prefersReducedMotion() || live.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % live.length), interval);
    return () => window.clearInterval(id);
  }, [visible, live.length, interval]);

  useEffect(() => {
    if (!visible || !overlay) return;
    let raf = 0;
    const start = performance.now();
    const loop = (t: number) => {
      const s = (t - start) / 1000;
      const f = Math.floor((s % 1) * 24);
      const sec = Math.floor(s) % 60;
      const min = Math.floor(s / 60) % 60;
      if (tc.current)
        tc.current.textContent = `00:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}:${String(
          f
        ).padStart(2, '0')}`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [visible, overlay]);

  return (
    <div ref={ref} className={`relative overflow-hidden bg-surface ${className}`}>
      {frames.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes={sizes}
          priority={priority && i === 0}
          className="object-cover"
          style={{ opacity: src === shown ? 1 : 0 }}
          onLoad={() => setReady((r) => (r.includes(src) ? r : [...r, src]))}
        />
      ))}
      {overlay && (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 text-white mix-blend-difference md:p-4">
          <div className="flex items-center justify-between">
            <span className="label flex items-center gap-2">
              <span className="h-2 w-2 animate-blink rounded-full bg-[#ff3b30]" /> Rec
            </span>
            <span className="label tabular-nums">
              {String(current + 1).padStart(2, '0')}/{String(Math.max(live.length, 1)).padStart(2, '0')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span ref={tc} className="label tabular-nums">
              00:00:00:00
            </span>
            <span className="label">24 fps</span>
          </div>
        </div>
      )}
    </div>
  );
}
