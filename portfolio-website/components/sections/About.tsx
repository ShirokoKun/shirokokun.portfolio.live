'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { capabilities, modeCopy, profile, stats } from '@/content/site';
import { useMode } from '@/components/providers/ModeProvider';
import { gsap, SplitText, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/motion';
import Reveal from '@/components/ui/Reveal';

export default function About() {
  const { mode } = useMode();
  const copy = modeCopy[mode];
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      // Portrait: shutter reveal, then slow parallax inside its frame.
      gsap.fromTo(
        '[data-portrait]',
        { clipPath: 'inset(0% 0% 100% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.4,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: '[data-portrait]', start: 'top 80%', once: true },
        }
      );
      gsap.fromTo(
        '[data-portrait-img]',
        { yPercent: -12, scale: 1.2 },
        {
          yPercent: 12,
          scale: 1.2,
          ease: 'none',
          scrollTrigger: { trigger: '[data-portrait]', start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );

      // Bio: words light up as you read down the page.
      gsap.utils.toArray<HTMLElement>('[data-bio]').forEach((p) => {
        const split = SplitText.create(p, { type: 'words' });
        splits.push(split);
        gsap.fromTo(
          split.words,
          { opacity: 0.18 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: { trigger: p, start: 'top 80%', end: 'bottom 45%', scrub: true },
          }
        );
      });

      // Stats count up.
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((node) => {
        const end = Number(node.dataset.count);
        const obj = { v: end > 1000 ? end - 40 : 0 };
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: { trigger: node, start: 'top 90%', once: true },
          onUpdate: () => {
            node.textContent = String(Math.round(obj.v));
          },
        });
      });

      gsap.from('[data-cap]', {
        y: 30,
        opacity: 0,
        stagger: 0.07,
        duration: 1,
        scrollTrigger: { trigger: '[data-caps]', start: 'top 85%', once: true },
      });
    }, el);
    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, [mode]);

  return (
    <section ref={root} id="about" aria-labelledby="about-title" className="relative py-24 md:py-36">
      <div className="shell grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <div data-portrait className="relative aspect-[4/5] overflow-hidden rounded-sm bg-surface">
              <div data-portrait-img className="absolute inset-0">
                <Image
                  src={profile.portrait}
                  alt={`${profile.name} under a pink sky, arms open`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className={`object-cover object-[50%_40%] transition-[filter] duration-700 ${
                    mode === 'personal' ? 'contrast-125 grayscale' : ''
                  }`}
                />
              </div>
              <span className="label absolute bottom-3 left-3 bg-bg px-2 py-1.5 text-fg">
                {mode === 'personal' ? `@${profile.handle}` : profile.name}
              </span>
            </div>
            <div className="mt-3 flex justify-between">
              <span className="label text-muted">{profile.location}</span>
              <span className="label text-muted">IIIT Bhubaneswar, CS</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <span className="label text-muted">About</span>
          <Reveal as="h2" id="about-title" by="words" className="display mt-4 text-big" key={`a-${mode}`}>
            {copy.aboutTitle}
          </Reveal>

          <div className="mt-10 space-y-6" key={`b-${mode}`}>
            {copy.about.map((p, i) => (
              <p
                key={i}
                data-bio
                className={
                  i === 0 ? 'text-2xl leading-tight md:text-[2rem]' : 'text-lg leading-snug text-fg/90 md:text-xl'
                }
              >
                {p}
              </p>
            ))}
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-line/15">
            {stats[mode].map((s) => (
              <div key={s.label} className="bg-bg p-5 md:p-6">
                <dd className="display flex items-baseline text-[clamp(2.5rem,5vw,4.5rem)] leading-none">
                  <span data-count={s.value}>{s.value}</span>
                  <span className="text-accent">{s.suffix}</span>
                </dd>
                <dt className="label mt-3 text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-20" data-caps>
            <span className="label text-muted">{mode === 'professional' ? 'Capabilities' : 'Toolbox'}</span>
            <ul className="mt-6">
              {capabilities.map((c, i) => (
                <li
                  key={c.title}
                  data-cap
                  className="group grid grid-cols-12 gap-4 border-t border-line/15 py-5 last:border-b"
                >
                  <span className="label col-span-2 pt-1.5 text-muted sm:col-span-1">0{i + 1}</span>
                  <div className="col-span-10 sm:col-span-6">
                    <h3 className="text-xl font-semibold transition-colors duration-300 group-hover:text-accent md:text-2xl">
                      {c.title}
                    </h3>
                    <p className="mt-1 text-muted">{c.detail}</p>
                  </div>
                  <div className="col-span-10 col-start-3 flex flex-wrap content-start gap-1.5 sm:col-span-5 sm:col-start-auto sm:justify-end">
                    {c.tools.map((t) => (
                      <span key={t} className="label rounded-full border border-line/20 px-2.5 py-1.5 text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
