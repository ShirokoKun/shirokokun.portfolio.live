'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { modeCopy, profile } from '@/content/site';

const copy = modeCopy.professional;

const SETTINGS: [string, string][] = [
  ['Format', 'Motion design, video editing, graphic design, UI & web'],
  ['Output', '100+ projects'],
  ['Clients', '20+ clients, 5+ brands'],
  ['Running since', '2019'],
  ['Location', `${profile.location} (IST)`],
  ['Training', 'B.Tech CS, IIIT Bhubaneswar'],
];

const PLUGINS = [
  'After Effects',
  'Premiere Pro',
  'DaVinci Resolve',
  'Alight Motion',
  'Blender',
  'Photoshop',
  'Illustrator',
  'Figma',
  'TouchDesigner',
  'React',
];

/** About, as an export dialog: the facts are the render settings. */
export default function RenderSettings() {
  const bar = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDone(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-line/15 py-20 md:py-28">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="tc text-muted">About</p>
          <h2 id="about-title" className="mt-4 text-pro-lg font-semibold">
            {copy.aboutTitle}
          </h2>
          <p className="mt-6 max-w-[46ch] text-pro-md text-muted">{copy.about}</p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-medium">
            {[
              { label: 'Résumé', href: profile.resume },
              ...profile.social.filter((s) => ['LinkedIn', 'GitHub'].includes(s.label)),
            ].map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer" className="link-underline">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-line/25 bg-bg shadow-[0_24px_60px_-30px_rgb(0_0_0/0.35)] lg:col-span-7">
          <div className="flex items-center justify-between border-b border-line/20 px-4 py-3">
            <span className="tc">Export settings</span>
            <span className="tc text-muted">swastik_gupta_2026.mov</span>
          </div>
          <div className="grid gap-6 p-4 sm:grid-cols-[minmax(0,180px)_1fr] md:p-6">
            <div className="relative aspect-[4/5] w-full max-w-[220px] overflow-hidden bg-surface">
              <Image
                src={profile.portrait}
                alt={`Portrait of ${profile.name}`}
                fill
                sizes="220px"
                className="object-cover object-top"
              />
              <span className="tc absolute bottom-2 left-2 bg-bg px-1.5 py-1">Preview</span>
            </div>
            <dl className="grid content-start gap-y-3 text-[15px]">
              {SETTINGS.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-line/10 pb-3">
                  <dt className="tc pt-1 text-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[8.5rem_1fr] gap-3">
                <dt className="tc pt-1 text-muted">Plugins</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {PLUGINS.map((p) => (
                    <span key={p} className="border border-line/20 px-2 py-1 text-[13px]">
                      {p}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
          <div className="flex flex-wrap items-center gap-4 border-t border-line/20 px-4 py-4 md:px-6">
            <div ref={bar} className="h-1.5 min-w-[140px] flex-1 overflow-hidden bg-line/10">
              <div
                className="h-full origin-left bg-accent transition-transform duration-[1.6s] ease-expo"
                style={{ transform: `scaleX(${done ? 1 : 0})` }}
              />
            </div>
            <span className="tc w-24 tabular-nums text-muted">{done ? 'Ready' : 'Rendering'}</span>
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="tc inline-flex h-10 items-center rounded-full bg-fg px-5 text-bg transition-colors hover:bg-accent hover:text-accent-ink"
            >
              Export résumé ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
