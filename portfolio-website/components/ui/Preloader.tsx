'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/motion';
import { profile } from '@/content/site';
import { useLenis } from '@/components/providers/SmoothScroll';
import { SEEN_KEY } from '@/lib/boot';

export const LOADED_EVENT = 'sg:loaded';

const announce = () => {
  (window as unknown as Record<string, boolean>)[LOADED_EVENT] = true;
  window.dispatchEvent(new Event(LOADED_EVENT));
};

/**
 * Timecode-style intro: a counter runs to 100 while the name builds, then the
 * panel wipes up like a shutter. Shown once per browser session.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const el = root.current;
    const seen = document.documentElement.dataset.seen === '1';
    if (!el || seen || prefersReducedMotion()) {
      setDone(true);
      announce();
      return;
    }

    const counter = el.querySelector<HTMLElement>('[data-counter]');
    const bar = el.querySelector<HTMLElement>('[data-bar]');
    const letters = el.querySelectorAll<HTMLElement>('[data-letter]');
    const state = { v: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem(SEEN_KEY, '1');
          } catch {}
          setDone(true);
        },
      });

      tl.from(letters, { yPercent: 110, stagger: 0.035, duration: 1, ease: 'expo.out' }, 0.1)
        .to(
          state,
          {
            v: 100,
            duration: 1.9,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (counter) counter.textContent = String(Math.round(state.v)).padStart(3, '0');
              if (bar) bar.style.transform = `scaleX(${state.v / 100})`;
            },
          },
          0
        )
        .to(letters, { yPercent: -110, stagger: 0.02, duration: 0.6, ease: 'expo.in' }, '+=0.15')
        .to(el.querySelectorAll('[data-fade]'), { opacity: 0, duration: 0.3 }, '<')
        .add(announce, '-=0.1')
        .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut' }, '-=0.15');
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hold scrolling while the intro plays.
  useEffect(() => {
    if (!lenis) return;
    if (done) lenis.start();
    else lenis.stop();
  }, [lenis, done]);

  if (done) return null;

  const word = `${profile.firstName} ${profile.lastName}`;

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[95] flex flex-col justify-between bg-fg p-4 text-bg sm:p-6 md:p-10"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      aria-hidden
    >
      <div data-fade className="flex items-start justify-between">
        <span className="label">Portfolio ©2026</span>
        <span className="label text-right">
          {profile.role}
          <br />
          {profile.location}
        </span>
      </div>

      <div className="overflow-hidden">
        <div className="display flex flex-wrap text-[clamp(3rem,12vw,13rem)] leading-[0.85]">
          {word.split('').map((c, i) => (
            <span key={i} data-letter className="inline-block whitespace-pre">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div data-fade className="flex items-end justify-between gap-6">
        <div className="flex-1">
          <div className="h-px w-full bg-bg/20">
            <div data-bar className="h-px origin-left scale-x-0 bg-accent" />
          </div>
          <span className="label mt-3 block text-bg/60">Rendering frames</span>
        </div>
        <span data-counter className="display text-[clamp(3rem,10vw,9rem)] leading-none tabular-nums">
          000
        </span>
      </div>
    </div>
  );
}
