'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { Project } from '@/content/site';
import { useLenis } from '@/components/providers/SmoothScroll';
import { EASE_EXPO, EASE_QUART } from '@/lib/motion';

type Props = {
  item: Pick<
    Project,
    'title' | 'context' | 'media' | 'description' | 'disciplines' | 'year' | 'link' | 'stat' | 'placeholder'
  > | null;
  onClose: () => void;
};

/** Full-screen viewer for a project: plays YouTube, shows images, or links out. */
export default function MediaModal({ item, onClose }: Props) {
  const lenis = useLenis();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isOpen = !!item;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseRef.current();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lenis?.start();
      prev?.focus?.();
    };
  }, [isOpen, lenis]);

  if (!mounted) return null;

  const vertical = item?.media.type === 'youtube' && item.media.vertical;

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          className="fixed inset-0 z-[85] flex flex-col bg-bg/95 backdrop-blur-xl"
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.8, ease: EASE_QUART }}
          data-lenis-prevent
        >
          <div className="shell flex items-center justify-between py-4">
            <span className="label text-muted">
              {item.year} · {item.disciplines.join(' / ')}
            </span>
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              className="label inline-flex h-10 items-center gap-2 rounded-full border border-line/25 px-4 hover:border-fg"
            >
              Close <span aria-hidden>✕</span>
            </button>
          </div>

          <div className="shell grid flex-1 gap-8 overflow-y-auto pb-10 lg:grid-cols-12 lg:items-center">
            <motion.div
              className="lg:col-span-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE_EXPO, delay: 0.35 }}
            >
              {item.media.type === 'youtube' && (
                <div
                  className={`relative mx-auto overflow-hidden bg-black ${
                    vertical ? 'aspect-[9/16] max-h-[78vh] w-auto' : 'aspect-video w-full'
                  }`}
                  style={vertical ? { height: '78vh', maxWidth: '100%' } : undefined}
                >
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${item.media.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                </div>
              )}
              {item.media.type === 'image' && (
                <div className="relative mx-auto h-[72vh] w-full">
                  <Image src={item.media.src} alt={item.title} fill sizes="70vw" className="object-contain" />
                </div>
              )}
              {item.media.type === 'link' && (
                <a
                  href={item.media.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="Open"
                  className="group relative flex aspect-video w-full flex-col justify-between overflow-hidden bg-fg p-6 text-bg md:p-10"
                >
                  <span className="label text-bg/60">{item.context}</span>
                  <span className="display text-big transition-colors duration-500 group-hover:text-accent">
                    {item.title}
                  </span>
                  <span className="label">Open externally ↗</span>
                </a>
              )}
            </motion.div>

            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE_EXPO, delay: 0.5 }}
            >
              <h2 className="display text-big">{item.title}</h2>
              <p className="mt-2 font-serif text-2xl italic text-muted">{item.context}</p>
              {item.stat && (
                <p className="label mt-6 inline-block bg-accent px-2 py-1.5 text-accent-ink">{item.stat}</p>
              )}
              <p className="mt-6 max-w-[46ch] text-lg leading-snug">{item.description}</p>
              {item.placeholder && (
                <p className="label mt-6 border-l-2 border-accent pl-3 leading-relaxed text-muted">
                  Featured pieces coming soon
                </p>
              )}
              {item.link && (
                <a
                  href={item.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="label mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-fg px-6 text-bg hover:bg-accent hover:text-accent-ink"
                >
                  {item.link.label} ↗
                </a>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
