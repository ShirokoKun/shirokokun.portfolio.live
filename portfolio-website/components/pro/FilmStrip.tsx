'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/motion';

/**
 * A strip of 35mm film running under the hero. It drifts on its own, speeds up
 * with scroll velocity and pauses off screen. Transform-only, so it never
 * triggers layout. Clicking anywhere plays the reel.
 */
export default function FilmStrip({ frames, label, onPlay }: { frames: string[]; label: string; onPlay: () => void }) {
  const wrap = useRef<HTMLButtonElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = wrap.current;
    if (!el || !track.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const drift = gsap.to(track.current, { xPercent: -50, duration: 70, ease: 'none', repeat: -1 });
      const boost = { v: 1 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? drift.play() : drift.pause()),
        onUpdate: (self) => {
          boost.v = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 8);
          gsap.to(drift, { timeScale: boost.v, duration: 0.2, overwrite: true });
          gsap.to(drift, { timeScale: 1, duration: 1.2, delay: 0.2, ease: 'power2.out' });
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const loop = [...frames, ...frames];

  return (
    <button
      ref={wrap}
      type="button"
      onClick={onPlay}
      data-cursor="Play"
      aria-label={`Play ${label}`}
      className="group relative block w-full overflow-hidden bg-[#121212] text-left"
    >
      <Sprockets />
      <div ref={track} className="flex w-max gap-2 px-1 will-change-transform">
        {loop.map((src, i) => (
          <Frame key={`${src}-${i}`} src={src} index={(i % frames.length) + 1} />
        ))}
      </div>
      <Sprockets />
      {/* Playhead */}
      <span className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-accent" aria-hidden />
      <span className="tc pointer-events-none absolute left-1/2 top-[22px] -translate-x-1/2 bg-accent px-2.5 py-1.5 text-accent-ink transition-transform duration-500 ease-expo group-hover:scale-110">
        ▶ {label}
      </span>
    </button>
  );
}

function Frame({ src, index }: { src: string; index: number }) {
  const [current, setCurrent] = useState(src);
  return (
    <div className="relative aspect-[16/10] w-[clamp(220px,26vw,420px)] shrink-0 overflow-hidden bg-[#1c1c1c]">
      {current && (
        <Image
          src={current}
          alt=""
          fill
          sizes="330px"
          className="object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
          onError={() =>
            setCurrent(current.includes('maxresdefault') ? current.replace('maxresdefault', 'hqdefault') : '')
          }
        />
      )}
      <span className="tc absolute bottom-2 left-2 text-[10px] text-white/70">{String(index).padStart(2, '0')}</span>
    </div>
  );
}

/** Perforations along the film edge, drawn with a repeating gradient. */
function Sprockets() {
  return (
    <div
      className="h-[18px] w-full"
      aria-hidden
      style={{
        backgroundImage:
          'repeating-linear-gradient(90deg, transparent 0 10px, rgb(238 236 231 / 0.85) 10px 22px, transparent 22px 34px)',
        backgroundSize: '34px 8px',
        backgroundRepeat: 'repeat-x',
        backgroundPosition: '0 center',
      }}
    />
  );
}
