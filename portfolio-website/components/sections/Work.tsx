'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { modeCopy, projectsFor, type Project } from '@/content/site';
import { useMode } from '@/components/providers/ModeProvider';
import { gsap, isFinePointer, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/motion';
import Reveal from '@/components/ui/Reveal';
import Cover from '@/components/ui/Cover';
import MediaModal from '@/components/ui/MediaModal';

export default function Work({ limit, showHeader = true }: { limit?: number; showHeader?: boolean }) {
  const { mode } = useMode();
  const copy = modeCopy[mode];
  const all = useMemo(() => projectsFor(mode), [mode]);
  const items = useMemo(() => (limit ? all.slice(0, limit) : all), [all, limit]);
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="work" className="relative py-24 md:py-36" aria-labelledby={showHeader ? 'work-title' : undefined}>
      {showHeader && (
        <div className="shell mb-12 grid gap-6 md:mb-20 md:grid-cols-12 md:items-end">
          <div className="md:col-span-12">
            <span className="label text-muted">
              ({String(all.length).padStart(2, '0')}) {copy.label}
            </span>
            <Reveal as="h2" id="work-title" by="chars" className="display mt-4 text-huge" key={`t-${mode}`}>
              {copy.workTitle}
            </Reveal>
          </div>
          <p className="max-w-[36ch] text-lg leading-snug text-muted md:col-span-5 md:col-start-8 md:justify-self-end">
            {copy.workIntro}
          </p>
        </div>
      )}

      {mode === 'professional' ? (
        <ProList items={items} onOpen={setActive} />
      ) : (
        <PersonalGrid items={items} onOpen={setActive} />
      )}

      {limit && all.length > limit && (
        <div className="shell mt-14 flex justify-center">
          <Link
            href="/work"
            className="label inline-flex h-12 items-center gap-3 rounded-full border border-line/25 px-6 hover:border-fg"
          >
            See all {all.length} in the archive →
          </Link>
        </div>
      )}

      <MediaModal item={active} onClose={() => setActive(null)} />
    </section>
  );
}

/** Professional: an index of rows with a cursor-following preview. */
function ProList({ items, onOpen }: { items: Project[]; onOpen: (p: Project) => void }) {
  const list = useRef<HTMLUListElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const el = list.current;
    const card = preview.current;
    if (!el || !card || !isFinePointer() || prefersReducedMotion()) return;
    gsap.set(card, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
    const xTo = gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power3.out' });
    const rTo = gsap.quickTo(card, 'rotation', { duration: 0.6, ease: 'power3.out' });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      xTo(x);
      yTo(e.clientY - r.top);
      rTo(gsap.utils.clamp(-12, 12, (x - lastX) * 0.6));
      lastX = x;
    };
    const enter = () => gsap.to(card, { scale: 1, opacity: 1, duration: 0.5, ease: 'expo.out' });
    const leave = () => gsap.to(card, { scale: 0, opacity: 0, duration: 0.4, ease: 'expo.in' });
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);

  useIsoLayoutEffect(() => {
    const el = list.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-row]', {
        yPercent: 40,
        opacity: 0,
        stagger: 0.06,
        duration: 1,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
      gsap.from('[data-rule]', {
        scaleX: 0,
        transformOrigin: 'left',
        stagger: 0.06,
        duration: 1.2,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [items]);

  return (
    <div className="shell relative">
      <div className="label hidden grid-cols-12 gap-4 pb-4 text-muted md:grid">
        <span className="col-span-1">No.</span>
        <span className="col-span-5">Project</span>
        <span className="col-span-3">Context</span>
        <span className="col-span-2">Discipline</span>
        <span className="col-span-1 text-right">Year</span>
      </div>
      <ul ref={list} className="relative" onPointerLeave={() => setHovered(null)}>
        {items.map((p, i) => (
          <li key={p.id} data-row className="relative">
            <span data-rule className="absolute inset-x-0 top-0 block h-px bg-line/15" aria-hidden />
            <button
              type="button"
              data-cursor={p.media.type === 'youtube' ? 'Play' : p.media.type === 'image' ? 'View' : 'Open'}
              onPointerEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onClick={() => onOpen(p)}
              className={`group grid w-full grid-cols-12 items-baseline gap-x-4 gap-y-1 py-5 text-left transition-opacity duration-500 md:py-7 ${
                hovered !== null && hovered !== i ? 'opacity-30' : 'opacity-100'
              }`}
            >
              <span className="label col-span-2 text-muted md:col-span-1">{String(i + 1).padStart(2, '0')}</span>
              <span className="display col-span-10 flex items-center gap-3 text-[clamp(1.6rem,3.3vw,3.4rem)] leading-[0.92] transition-transform duration-700 ease-expo group-hover:translate-x-4 md:col-span-5">
                {p.title}
                {p.featured && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" aria-label="Featured" />}
              </span>
              <span className="col-span-10 col-start-3 text-sm text-muted md:col-span-3 md:col-start-auto md:text-base">
                {p.context}
              </span>
              <span className="label col-span-10 col-start-3 text-muted md:col-span-2 md:col-start-auto">
                {p.disciplines.slice(0, 2).join(' / ')}
              </span>
              <span className="label col-span-12 hidden text-right md:col-span-1 md:block">{p.year}</span>
            </button>
          </li>
        ))}
        <span className="absolute inset-x-0 bottom-0 block h-px bg-line/15" aria-hidden />
      </ul>

      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 hidden aspect-[4/3] w-[clamp(220px,24vw,380px)] overflow-hidden md:block"
      >
        {items.map((p, i) => (
          <div
            key={p.id}
            className="absolute inset-0 transition-[clip-path] duration-700 ease-expo"
            style={{ clipPath: hovered === i ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
          >
            <Cover project={p} sizes="380px" className="h-full w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Personal: a loose wall of phone-shaped cards with columns that drift at different speeds. */
function PersonalGrid({ items, onOpen }: { items: Project[]; onOpen: (p: Project) => void }) {
  const grid = useRef<HTMLDivElement>(null);
  const cols = useMemo(() => [0, 1, 2].map((c) => items.filter((_, i) => i % 3 === c)), [items]);

  useIsoLayoutEffect(() => {
    const el = grid.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        gsap.utils.toArray<HTMLElement>('[data-col]').forEach((col, i) => {
          gsap.fromTo(
            col,
            { y: [60, 160, 20][i] },
            {
              y: [-60, -160, -20][i],
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
        });
      });
      gsap.from('[data-card]', {
        y: 80,
        opacity: 0,
        rotate: () => gsap.utils.random(-6, 6),
        stagger: 0.05,
        duration: 1.2,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [items]);

  return (
    <div ref={grid} className="shell grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
      {cols.map((col, c) => (
        <div key={c} data-col className="flex flex-col gap-4 md:gap-6">
          {col.map((p) => (
            <button
              key={p.id}
              type="button"
              data-card
              data-cursor="Play"
              onClick={() => onOpen(p)}
              className="group relative block text-left"
            >
              <div className="relative overflow-hidden rounded-[14px]">
                <Cover
                  project={p}
                  bare
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={`w-full transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.06] ${
                    p.media.type === 'youtube' && p.media.vertical ? 'aspect-[4/5]' : 'aspect-video'
                  }`}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                {p.stat && (
                  <span className="label absolute left-3 top-3 bg-accent px-2 py-1.5 text-accent-ink">{p.stat}</span>
                )}
                <span className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-white">
                  <span>
                    <span className="display block text-2xl leading-none md:text-3xl">{p.title}</span>
                    <span className="mt-1 block text-sm text-white/70">{p.context}</span>
                  </span>
                  <span className="label shrink-0 text-white/70">{p.year}</span>
                </span>
                <span className="absolute right-3 top-3 flex h-10 w-10 scale-0 items-center justify-center rounded-full bg-accent text-accent-ink transition-transform duration-500 ease-expo group-hover:scale-100">
                  ▶
                </span>
              </div>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
