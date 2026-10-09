'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { modeCopy, projects } from '@/content/site';
import MediaModal from '@/components/ui/MediaModal';

const copy = modeCopy.personal;
const latest = projects.find((p) => p.id === 'roshni')!;

/**
 * After hours, screen one: a collage. The name is set like a poster and every
 * sticker on it can be grabbed and thrown.
 */
export default function PersonalHero() {
  const area = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  // A throw ends with a click event; ignore it so dragging the phone does not open it.
  const dragged = useRef(false);

  const sticker = {
    drag: true,
    dragConstraints: area,
    dragElastic: 0.25,
    dragMomentum: true,
    whileDrag: { scale: 1.06, rotate: 0, zIndex: 30 },
    whileHover: { scale: 1.03 },
  } as const;

  return (
    <section ref={area} aria-labelledby="hero-title" className="relative min-h-[100svh] overflow-hidden pt-12 md:pt-14">
      {/* The name, with a lime echo knocked out behind it */}
      <div className="pointer-events-none absolute inset-x-0 top-[16vh] select-none md:top-[12vh]">
        <motion.h1
          id="hero-title"
          className="poster relative -rotate-[4deg] whitespace-nowrap text-center text-poster-xl max-md:text-[22vw]"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.1 }}
        >
          <span
            className="absolute inset-0 translate-x-[0.035em] translate-y-[0.03em] text-transparent"
            style={{ WebkitTextStroke: '2px rgb(var(--accent))' }}
            aria-hidden
          >
            sxk.m4in
          </span>
          <span className="relative">sxk.m4in</span>
        </motion.h1>
      </div>

      {/* Stickers */}
      <motion.div
        {...sticker}
        className="absolute left-[6%] top-[46%] z-10 md:top-[52%] flex h-36 w-36 cursor-grab flex-col items-center justify-center rounded-full bg-accent text-center text-accent-ink active:cursor-grabbing md:h-44 md:w-44"
        style={{ rotate: -12 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.5 }}
      >
        <span className="poster text-5xl leading-none md:text-6xl">865K</span>
        <span className="tw mt-1 px-4 text-[10px] leading-tight">views on one edit</span>
      </motion.div>

      <motion.div
        {...sticker}
        className="tw absolute right-[6%] top-[36%] z-10 md:right-[8%] md:top-[18%] cursor-grab bg-[#f1ead7]/90 px-5 py-2 text-[13px] text-[#111] active:cursor-grabbing"
        style={{ rotate: 8 }}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.7 }}
      >
        after hours · est. 2019
      </motion.div>

      <motion.button
        {...sticker}
        type="button"
        onDragStart={() => (dragged.current = true)}
        onDragEnd={() => window.setTimeout(() => (dragged.current = false), 60)}
        onClick={() => !dragged.current && setPlaying(true)}
        data-cursor="Play"
        className="absolute bottom-[30%] right-[6%] z-10 w-[min(36vw,200px)] md:bottom-[10%] cursor-grab border-[6px] border-[#1d1d1f] bg-[#1d1d1f] text-left shadow-2xl active:cursor-grabbing md:right-[14%]"
        style={{ rotate: 5 }}
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 140, damping: 16, delay: 0.6 }}
      >
        <span className="relative block aspect-[9/16] overflow-hidden rounded-[10px] bg-surface">
          {latest.cover && (
            <Image
              src={latest.cover}
              alt=""
              fill
              sizes="200px"
              className="pointer-events-none object-cover text-transparent"
            />
          )}
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
            <span className="tw block text-[10px] text-accent">Latest drop ▶</span>
            <span className="poster block text-2xl leading-none">{latest.title}</span>
          </span>
        </span>
      </motion.button>

      <motion.div
        {...sticker}
        className="absolute left-[34%] top-[58%] z-0 hidden w-44 cursor-grab bg-[#f1ead7] p-2 pb-8 shadow-xl active:cursor-grabbing md:block"
        style={{ rotate: -6 }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.8 }}
      >
        <span className="relative block aspect-[3/4] overflow-hidden">
          <Image
            src="/work/posters/gojo-poster.webp"
            alt=""
            fill
            sizes="180px"
            className="pointer-events-none object-cover"
          />
        </span>
        <span className="tw absolute bottom-2 left-2 text-[11px] text-[#111]">gojo satoru</span>
      </motion.div>

      <div className="shell absolute inset-x-0 bottom-8 z-20 md:bottom-10">
        <p className="tw max-w-[30ch] text-[14px] text-fg">{copy.heroIntro}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <a
            href="#board"
            className="tw inline-flex h-11 -rotate-1 items-center bg-accent px-5 text-accent-ink transition-transform hover:rotate-0"
          >
            Open the board ↓
          </a>
          <span className="tw hidden text-muted md:inline">psst, the stickers move</span>
        </div>
      </div>

      <MediaModal item={playing ? latest : null} onClose={() => setPlaying(false)} />
    </section>
  );
}
