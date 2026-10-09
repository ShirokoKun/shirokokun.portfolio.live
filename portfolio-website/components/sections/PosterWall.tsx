'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { posters, type Poster } from '@/content/site';
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/motion';
import Reveal from '@/components/ui/Reveal';
import MediaModal from '@/components/ui/MediaModal';

/**
 * Pinned horizontal gallery. Vertical scroll drives the strip sideways and
 * each poster leans into the motion, like prints swinging on a line.
 */
export default function PosterWall() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Poster | null>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    const strip = track.current;
    if (!el || !strip || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        const distance = () => strip.scrollWidth - window.innerWidth;
        const skew = gsap.quickTo('[data-poster]', 'rotation', { duration: 0.6, ease: 'power3.out' });
        gsap.to(strip, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => skew(gsap.utils.clamp(-6, 6, self.getVelocity() / -300)),
            onScrubComplete: () => skew(0),
          },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="posters"
      aria-labelledby="posters-title"
      className="relative overflow-hidden py-20 md:flex md:h-[100svh] md:flex-col md:justify-center md:py-0"
    >
      <div className="shell mb-10 flex items-end justify-between gap-6 md:mb-12">
        <div>
          <span className="label text-muted">({posters.length}) Poster archive</span>
          <Reveal as="h2" id="posters-title" by="chars" className="display mt-4 text-huge">
            Wall of prints
          </Reveal>
        </div>
        <p className="label hidden max-w-[30ch] text-right leading-relaxed text-muted md:block">
          Grunge, type and too much halftone. Scroll to flip through, click to look closer.
        </p>
      </div>

      <div
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory items-end gap-4 overflow-x-auto px-4 sm:px-6 md:snap-none md:gap-8 md:overflow-visible md:px-10"
      >
        {posters.map((p, i) => (
          <button
            key={p.src}
            type="button"
            data-poster
            data-cursor="View"
            onClick={() => setActive(p)}
            className="group w-[68vw] shrink-0 snap-center text-left will-change-transform sm:w-[42vw] md:w-auto"
            style={{ transformOrigin: '50% 0%' }}
          >
            <div
              className="relative overflow-hidden bg-surface md:h-[min(56vh,560px)]"
              style={{ aspectRatio: `${p.w} / ${p.h}` }}
            >
              <Image
                src={p.src}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 70vw, 30vw"
                className="object-cover transition-transform duration-[1.2s] ease-expo group-hover:scale-105"
              />
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-4">
              <span className="text-sm font-medium">{p.title}</span>
              <span className="label text-muted">
                {String(i + 1).padStart(2, '0')}
                {p.year ? ` · ${p.year}` : ''}
              </span>
            </div>
          </button>
        ))}
        <div className="flex w-[40vw] shrink-0 items-center justify-center md:w-[24vw]" aria-hidden>
          <span className="font-serif text-4xl italic text-muted">more soon…</span>
        </div>
      </div>

      <MediaModal
        item={
          active
            ? {
                title: active.title,
                context: 'Poster',
                media: { type: 'image', src: active.src },
                description: 'Personal poster work. Part of an ongoing series of type-heavy, grunge-leaning prints.',
                disciplines: ['Poster', 'Graphic Design'],
                year: active.year ?? 'Undated',
              }
            : null
        }
        onClose={() => setActive(null)}
      />
    </section>
  );
}
