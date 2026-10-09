'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { modeCopy, profile, showreel } from '@/content/site';
import { EASE_EXPO } from '@/lib/motion';
import FilmStrip from './FilmStrip';
import MediaModal from '@/components/ui/MediaModal';

const copy = modeCopy.professional;
const reel = showreel.professional;

/** Edit suite, screen one: who, what, and the work already rolling underneath. */
export default function ProHero() {
  const [playing, setPlaying] = useState(false);

  return (
    <section aria-labelledby="hero-title" className="flex min-h-[100svh] flex-col pt-12 md:pt-14">
      <div className="shell grid flex-1 content-end gap-8 pb-10 pt-14 md:pb-14 lg:grid-cols-12">
        <div className="lg:col-span-9">
          <motion.p
            className="tc flex items-center gap-2 text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="h-2 w-2 animate-blink rounded-full bg-accent" aria-hidden />
            {copy.status}
          </motion.p>
          <h1 id="hero-title" className="mt-6 text-pro-hero font-semibold">
            {copy.heroLines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={`block ${i === 1 ? 'font-serif text-[1.08em] font-normal italic tracking-[-0.02em]' : ''}`}
                  initial={{ y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.1, ease: EASE_EXPO, delay: 0.15 + i * 0.1 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>
        <motion.div
          className="lg:col-span-3 lg:pb-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_EXPO, delay: 0.45 }}
        >
          <p className="max-w-[40ch] text-pro-md text-muted">{copy.heroIntro}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#timeline"
              className="tc inline-flex h-11 items-center gap-2 rounded-full bg-fg px-5 text-bg transition-colors hover:bg-accent hover:text-accent-ink"
            >
              See the work ↓
            </a>
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="tc inline-flex h-11 items-center gap-2 rounded-full border border-line/30 px-5 transition-colors hover:border-fg"
            >
              Résumé ↗
            </a>
          </div>
        </motion.div>
      </div>

      <FilmStrip frames={reel.frames} label={reel.title} onPlay={() => setPlaying(true)} />
      <p className="shell tc mt-3 text-muted">{reel.caption}</p>

      <MediaModal
        item={
          playing
            ? {
                title: reel.title,
                context: 'Showreel',
                media: { type: 'youtube', id: reel.youtubeId },
                description: reel.caption,
                disciplines: ['Motion', 'Edit'],
                year: '2026',
                placeholder: reel.placeholder,
              }
            : null
        }
        onClose={() => setPlaying(false)}
      />
    </section>
  );
}
