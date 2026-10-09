'use client';

import { useRef, useState } from 'react';
import { showreel } from '@/content/site';
import { useMode } from '@/components/providers/ModeProvider';
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/motion';
import FrameCycler from '@/components/ui/FrameCycler';
import MediaModal from '@/components/ui/MediaModal';

/**
 * Pinned reel: as you scroll, the frame grows from a thumbnail to full bleed
 * while "PLAY" and "REEL" slide apart around it. Click anywhere to watch.
 */
export default function Showreel() {
  const { mode } = useMode();
  const reel = showreel[mode];
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top top', end: '+=120%', scrub: 0.6, pin: '[data-pin]' },
        });
        tl.fromTo('[data-frame]', { scale: 0.42, borderRadius: 4 }, { scale: 1, borderRadius: 0, ease: 'power2.inOut' })
          .fromTo('[data-word="a"]', { xPercent: 0 }, { xPercent: -60, ease: 'power2.inOut' }, 0)
          .fromTo('[data-word="b"]', { xPercent: 0 }, { xPercent: 60, ease: 'power2.inOut' }, 0)
          .fromTo('[data-caption]', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.7);
      });
      mm.add('(max-width: 767px)', () => {
        gsap.from('[data-frame]', {
          scale: 0.85,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'center center', scrub: true },
        });
      });
    }, el);
    return () => ctx.revert();
  }, [mode]);

  return (
    <section ref={root} id="reel" aria-label="Showreel" className="relative">
      <div data-pin className="relative flex min-h-[70vh] items-center justify-center overflow-hidden md:h-[100svh]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          data-cursor="Play"
          data-frame
          className="relative aspect-video w-[92vw] overflow-hidden md:h-[100svh] md:w-full md:aspect-auto"
          aria-label={`Play ${reel.title}`}
        >
          <FrameCycler key={mode} frames={reel.frames} interval={520} className="absolute inset-0" sizes="100vw" />
          <span className="absolute inset-0 bg-black/20" />
        </button>

        <div className="pointer-events-none absolute inset-0 hidden items-center justify-center gap-[2vw] text-white mix-blend-difference md:flex">
          <span data-word="a" className="display text-[14vw] leading-none">
            Play
          </span>
          <span data-word="b" className="display text-[14vw] leading-none">
            Reel
          </span>
        </div>

        <div
          data-caption
          className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-4 text-white md:p-10"
        >
          <span className="display text-big">{reel.title}</span>
          <span className="label hidden max-w-[34ch] text-right leading-relaxed md:block">{reel.caption}</span>
        </div>
      </div>
      <p className="shell label mt-3 text-muted md:hidden">{reel.caption}</p>

      <MediaModal
        item={
          open
            ? {
                title: reel.title,
                context: reel.placeholder ? 'Placeholder until the 2026 reel ships' : 'Latest',
                media: { type: 'youtube', id: reel.youtubeId },
                description: reel.caption,
                disciplines: ['Reel'],
                year: '2026',
              }
            : null
        }
        onClose={() => setOpen(false)}
      />
    </section>
  );
}
