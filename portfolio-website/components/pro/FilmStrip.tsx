'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/motion';
import { hasWebGL, useIdleReady, useInView } from '@/lib/webgl';

// three.js only loads after first paint, and never for reduced motion or without WebGL.
const FilmReel = dynamic(() => import('@/components/three/FilmReel'), { ssr: false });

/**
 * A strip of 35mm film running under the hero. The DOM strip renders first and
 * stays as the fallback; once the page is idle a WebGL reel takes over in the
 * same box (no layout shift) and the DOM drift stops. Clicking plays the reel.
 */
export default function FilmStrip({ frames, label, onPlay }: { frames: string[]; label: string; onPlay: () => void }) {
  const wrap = useRef<HTMLButtonElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const drift = useRef<gsap.core.Tween | null>(null);
  const idle = useIdleReady(600);
  const inView = useInView(wrap);
  const [canGL, setCanGL] = useState(false);
  const [glOn, setGlOn] = useState(false);

  useEffect(() => setCanGL(hasWebGL() && !prefersReducedMotion()), []);

  useIsoLayoutEffect(() => {
    const el = wrap.current;
    if (!el || !track.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tween = gsap.to(track.current, { xPercent: -50, duration: 70, ease: 'none', repeat: -1 });
      drift.current = tween;
      const boost = { v: 1 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive && !tween.data ? tween.play() : tween.pause()),
        onUpdate: (self) => {
          boost.v = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 8);
          gsap.to(tween, { timeScale: boost.v, duration: 0.2, overwrite: true });
          gsap.to(tween, { timeScale: 1, duration: 1.2, delay: 0.2, ease: 'power2.out' });
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // Once WebGL is drawing, the DOM strip underneath stops moving.
  useEffect(() => {
    const t = drift.current;
    if (!t || !glOn) return;
    t.data = 'gl';
    t.pause();
  }, [glOn]);

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
      {canGL && idle && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${glOn ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden
        >
          <FilmReel frames={frames} live={inView} onReady={() => setGlOn(true)} />
        </div>
      )}
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
