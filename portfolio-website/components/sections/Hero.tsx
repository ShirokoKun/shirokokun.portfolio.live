'use client';

import { useEffect, useRef } from 'react';
import { modeCopy, profile, showreel } from '@/content/site';
import { useMode } from '@/components/providers/ModeProvider';
import { gsap, isFinePointer, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/motion';
import { LOADED_EVENT } from '@/components/ui/Preloader';
import LocalTime from '@/components/ui/LocalTime';
import FrameCycler from '@/components/ui/FrameCycler';
import Magnetic from '@/components/ui/Magnetic';
import Reveal from '@/components/ui/Reveal';

const BASE = { wdth: 92, wght: 800 };
const PEAK = { wdth: 125, wght: 900 };
const RADIUS = 260;

function Line({ text, align }: { text: string; align: 'left' | 'right' }) {
  return (
    <span className={`flex overflow-hidden ${align === 'right' ? 'justify-end' : ''}`} aria-hidden>
      {text.split('').map((c, i) => (
        <span
          key={i}
          data-letter
          className="inline-block whitespace-pre will-change-transform"
          style={{ fontVariationSettings: `'wdth' ${BASE.wdth}, 'wght' ${BASE.wght}` }}
        >
          {c}
        </span>
      ))}
    </span>
  );
}

/**
 * Giant kinetic title. Every letter is a variable-font instance: as the pointer
 * passes, nearby letters widen and thicken, so the name breathes like a
 * squash-and-stretch rig.
 */
export default function Hero() {
  const { mode } = useMode();
  const copy = modeCopy[mode];
  const root = useRef<HTMLElement>(null);
  const reel = useRef<HTMLDivElement>(null);

  // Entrance: letters rise out of their masks once the preloader lifts.
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const letters = el.querySelectorAll('[data-letter]');
      const fades = el.querySelectorAll('[data-hero-fade]');
      gsap.set(letters, { yPercent: 105 });
      gsap.set(fades, { opacity: 0, y: 20 });
      gsap.set(reel.current, { clipPath: 'inset(100% 0% 0% 0%)' });
      const play = () => {
        const tl = gsap.timeline();
        tl.to(letters, { yPercent: 0, duration: 1.4, stagger: 0.04, ease: 'expo.out' })
          .to(reel.current, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' }, 0.2)
          .to(fades, { opacity: 1, y: 0, duration: 1, stagger: 0.06 }, 0.5);
      };
      if ((window as unknown as Record<string, boolean>)[LOADED_EVENT]) play();
      else window.addEventListener(LOADED_EVENT, play, { once: true });

      // Scroll out: title drifts up and the reel card parallaxes.
      gsap.to('[data-hero-title]', {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(reel.current, {
        yPercent: -40,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, [mode]);

  // Pointer-reactive variable font.
  useEffect(() => {
    const el = root.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return;
    const letters = Array.from(el.querySelectorAll<HTMLElement>('[data-letter]'));
    const state = letters.map(() => ({ w: BASE.wdth, g: BASE.wght }));
    const pointer = { x: -9999, y: -9999 };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const tick = () => {
      letters.forEach((letter, i) => {
        const r = letter.getBoundingClientRect();
        const d = Math.hypot(pointer.x - (r.left + r.width / 2), pointer.y - (r.top + r.height / 2));
        const f = Math.max(0, 1 - d / RADIUS);
        const ease = f * f * (3 - 2 * f);
        const tw = BASE.wdth + (PEAK.wdth - BASE.wdth) * ease;
        const tg = BASE.wght + (PEAK.wght - BASE.wght) * ease;
        const s = state[i];
        s.w += (tw - s.w) * 0.14;
        s.g += (tg - s.g) * 0.14;
        letter.style.fontVariationSettings = `'wdth' ${s.w.toFixed(1)}, 'wght' ${s.g.toFixed(0)}`;
      });
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    gsap.ticker.add(tick);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.ticker.remove(tick);
    };
  }, [mode]);

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pb-6 pt-24 md:pb-8 md:pt-28"
    >
      <div className="shell grid grid-cols-2 gap-4 md:grid-cols-4" data-hero-fade>
        <span className="label text-muted">Portfolio ©2026</span>
        <span className="label hidden text-muted md:block">{profile.location}</span>
        <span className="label hidden text-muted md:block">
          <LocalTime />
        </span>
        <span className="label flex items-center justify-end gap-2 text-right">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {copy.status}
        </span>
      </div>

      <div className="shell relative mt-10 md:mt-6">
        <h1
          data-hero-title
          className="display relative text-[clamp(4.2rem,15.5vw,18rem)] leading-[0.8] tracking-[-0.045em]"
        >
          <span className="sr-only">
            {profile.name}, {copy.heroLines.join(' ')} {copy.heroAccent}
          </span>
          <span className="relative block">
            <Line text={copy.heroLines[0]} align="left" />
            <span
              data-hero-fade
              className="absolute bottom-[0.18em] right-0 z-10 hidden max-w-[40%] text-right font-serif text-[clamp(1.5rem,3.6vw,4rem)] normal-case italic leading-[0.95] tracking-normal text-accent md:block"
              style={{ fontVariationSettings: 'normal', fontWeight: 400 }}
              aria-hidden
            >
              {copy.heroAccent}
            </span>
          </span>
          <Line text={copy.heroLines[1]} align="right" />
        </h1>
        <p data-hero-fade className="mt-3 font-serif text-2xl italic text-accent md:hidden" aria-hidden>
          {copy.heroAccent}
        </p>
      </div>

      <div className="shell mt-10 grid items-end gap-8 md:grid-cols-12">
        <div className="md:col-span-5 lg:col-span-4">
          <Reveal
            as="p"
            by="lines"
            waitFor={LOADED_EVENT}
            delay={0.6}
            className="max-w-[38ch] text-lg leading-snug md:text-xl"
          >
            {copy.heroIntro}
          </Reveal>
          <div className="mt-6 flex flex-wrap items-center gap-3" data-hero-fade>
            <Magnetic>
              <a
                href="#work"
                className="label inline-flex h-12 items-center gap-3 rounded-full bg-fg px-6 text-bg transition-colors duration-300 hover:bg-accent hover:text-accent-ink"
              >
                See the work <span aria-hidden>↓</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="label inline-flex h-12 items-center gap-3 rounded-full border border-line/25 px-6 transition-colors duration-300 hover:border-fg"
              >
                Résumé <span aria-hidden>↗</span>
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="md:col-span-7 md:col-start-6 lg:col-span-5 lg:col-start-8">
          <a href="#reel" data-cursor="Watch" className="group block" aria-label={`Jump to ${showreel[mode].title}`}>
            <div ref={reel} className="relative">
              <FrameCycler
                key={mode}
                frames={showreel[mode].frames}
                className="aspect-video w-full rounded-sm"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            </div>
            <div className="mt-2 flex items-center justify-between" data-hero-fade>
              <span className="label text-muted">{showreel[mode].title}</span>
              <span className="label text-muted transition-colors group-hover:text-accent">Scroll to play ↓</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
