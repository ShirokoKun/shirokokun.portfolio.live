'use client';

import { useRef } from 'react';
import { experience, journey, modeCopy } from '@/content/site';
import { useMode } from '@/components/providers/ModeProvider';
import { gsap, ScrollTrigger, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/motion';
import Reveal from '@/components/ui/Reveal';

/** Experience (professional) or Journey (personal), drawn as a scrubbed timeline. */
export default function Timeline() {
  const { mode } = useMode();
  const items = mode === 'professional' ? experience : journey;
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-progress]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-list]', start: 'top 70%', end: 'bottom 60%', scrub: true },
        }
      );
      gsap.utils.toArray<HTMLElement>('[data-item]').forEach((item) => {
        gsap.from(item.querySelectorAll('[data-in]'), {
          y: 40,
          opacity: 0,
          stagger: 0.06,
          duration: 1,
          scrollTrigger: { trigger: item, start: 'top 85%', once: true },
        });
        const dot = item.querySelector('[data-dot]');
        if (dot)
          ScrollTrigger.create({ trigger: item, start: 'top 60%', toggleClass: { targets: dot, className: 'is-on' } });
      });
    }, el);
    return () => ctx.revert();
  }, [mode]);

  return (
    <section ref={root} id="timeline" aria-labelledby="timeline-title" className="relative py-24 md:py-36">
      <div className="shell grid gap-10 md:grid-cols-12">
        <div className="md:col-span-12">
          <span className="label text-muted">{mode === 'professional' ? 'Where I have worked' : 'How I got here'}</span>
          <Reveal as="h2" id="timeline-title" by="chars" className="display mt-4 text-huge" key={`tl-${mode}`}>
            {modeCopy[mode].timelineTitle}
          </Reveal>
        </div>

        <aside className="md:col-span-3">
          <p className="font-serif text-2xl italic leading-tight text-muted md:sticky md:top-28">
            {mode === 'professional'
              ? 'Five years across studios, startups, fests and freelance. Currently designing motion at IDK Show.'
              : 'From phone edits in 2019 to music visuals for artists I love.'}
          </p>
        </aside>

        <ol data-list className="relative md:col-span-8 md:col-start-5">
          <span
            className="absolute bottom-0 left-[7px] top-0 w-px bg-line/15 md:left-[calc(16.666%+7px)]"
            aria-hidden
          />
          <span
            data-progress
            className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-accent md:left-[calc(16.666%+7px)]"
            aria-hidden
          />
          {items.map((t) => (
            <li key={`${t.year}-${t.title}`} data-item className="relative grid grid-cols-12 gap-4 pb-12 last:pb-0">
              <span data-in className="label col-span-12 pl-8 pt-2 text-muted md:col-span-2 md:pl-0">
                {t.year}
              </span>
              <span
                data-dot
                className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border transition-colors duration-500 md:left-[16.666%] [&.is-on]:border-accent [&.is-on]:bg-accent ${
                  t.current ? 'border-accent bg-accent' : 'border-line/30 bg-bg'
                }`}
                aria-hidden
              />
              <div className="col-span-12 pl-8 md:col-span-10 md:pl-10">
                <h3 data-in className="display text-[clamp(1.6rem,3.2vw,3rem)] leading-none">
                  {t.title}
                </h3>
                <p data-in className="mt-2 font-serif text-xl italic text-accent">
                  {t.org}
                  {t.current && <span className="label ml-3 align-middle not-italic text-muted">Current</span>}
                </p>
                <p data-in className="mt-3 max-w-[52ch] text-muted">
                  {t.note}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
