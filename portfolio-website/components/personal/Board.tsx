'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { notes, posters, projects, type Poster, type Project } from '@/content/site';
import { gsap, prefersReducedMotion } from '@/lib/motion';
import MediaModal from '@/components/ui/MediaModal';

type Item =
  | { key: string; kind: 'poster'; w: number; h: number; poster: Poster }
  | { key: string; kind: 'edit'; w: number; h: number; project: Project }
  | { key: string; kind: 'note'; w: number; h: number; note: (typeof notes)[number] };

const COLS = 8;
const ROWS = 5;
const CELL_W = 330;
const CELL_H = 370;
const W = COLS * CELL_W;
const H = ROWS * CELL_H;

/** Small deterministic RNG, so the server and client agree on the first layout. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildItems(): Item[] {
  const edits = projects.filter((p) => p.modes.includes('personal'));
  return [
    ...posters.map((p) => ({
      key: p.src,
      kind: 'poster' as const,
      w: 230,
      h: Math.round((230 * p.h) / p.w),
      poster: p,
    })),
    ...edits.map((p) => {
      const vertical = p.media.type === 'youtube' && p.media.vertical;
      return { key: p.id, kind: 'edit' as const, w: vertical ? 180 : 300, h: vertical ? 320 : 169, project: p };
    }),
    ...notes.map((n) => ({ key: n.title, kind: 'note' as const, w: 210, h: 180, note: n })),
  ];
}

function layout(items: Item[], seed: number) {
  const r = rng(seed);
  const cells = Array.from({ length: COLS * ROWS }, (_, i) => i);
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  return items.map((it, i) => {
    const cell = cells[i % cells.length];
    const cx = (cell % COLS) * CELL_W;
    const cy = Math.floor(cell / COLS) * CELL_H;
    return {
      x: cx + (CELL_W - it.w) / 2 + (r() - 0.5) * 50,
      y: cy + (CELL_H - it.h) / 2 + (r() - 0.5) * 40,
      rot: (r() - 0.5) * 12,
    };
  });
}

/**
 * The after-hours board: every poster, edit and note pinned to one big wall.
 * Drag to pan (with a throw), the wall skews with your speed, shuffle re-pins
 * everything. On touch it is a native scroll area.
 */
export default function Board() {
  const items = useMemo(buildItems, []);
  const [seed, setSeed] = useState(7);
  const pos = useMemo(() => layout(items, seed), [items, seed]);
  const [open, setOpen] = useState<Item | null>(null);

  const view = useRef<HTMLDivElement>(null);
  const wall = useRef<HTMLDivElement>(null);
  const mini = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  // Start in the middle of the wall.
  useEffect(() => {
    const v = view.current;
    if (!v) return;
    v.scrollLeft = (W - v.clientWidth) / 2;
    v.scrollTop = (H - v.clientHeight) / 2;
  }, []);

  // Keep the minimap's viewport box in sync (one transform per scroll event).
  useEffect(() => {
    const v = view.current;
    const m = mini.current;
    if (!v || !m) return;
    const sync = () => {
      m.style.transform = `translate(${(v.scrollLeft / W) * 100 * (W / v.clientWidth)}%, ${
        (v.scrollTop / H) * 100 * (H / v.clientHeight)
      }%)`;
      m.style.width = `${(v.clientWidth / W) * 100}%`;
      m.style.height = `${(v.clientHeight / H) * 100}%`;
    };
    sync();
    v.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      v.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  // Mouse drag to pan, with a throw and a speed skew. Touch keeps native scrolling.
  useEffect(() => {
    const v = view.current;
    const w = wall.current;
    if (!v || !w) return;
    const calm = prefersReducedMotion();
    let down = false;
    let sx = 0;
    let sy = 0;
    let lx = 0;
    let ly = 0;
    let vx = 0;
    let vy = 0;
    let lt = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true;
      moved.current = false;
      sx = lx = e.clientX;
      sy = ly = e.clientY;
      lt = performance.now();
      vx = vy = 0;
      gsap.killTweensOf(v);
      v.setPointerCapture(e.pointerId);
      v.style.cursor = 'grabbing';
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const now = performance.now();
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      const dt = Math.max(now - lt, 1);
      vx = dx / dt;
      vy = dy / dt;
      lx = e.clientX;
      ly = e.clientY;
      lt = now;
      if (Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > 6) moved.current = true;
      v.scrollLeft -= dx;
      v.scrollTop -= dy;
      if (!calm) {
        const kx = gsap.utils.clamp(-3, 3, vx * 2);
        const ky = gsap.utils.clamp(-3, 3, vy * 2);
        w.style.transform = `skew(${-kx}deg, ${-ky * 0.5}deg)`;
      }
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      v.releasePointerCapture(e.pointerId);
      v.style.cursor = '';
      if (calm) return;
      gsap.to(v, {
        scrollLeft: v.scrollLeft - vx * 320,
        scrollTop: v.scrollTop - vy * 320,
        duration: 1.1,
        ease: 'power3.out',
      });
      gsap.to(w, { skewX: 0, skewY: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)', clearProps: 'transform' });
    };

    v.addEventListener('pointerdown', onDown);
    v.addEventListener('pointermove', onMove);
    v.addEventListener('pointerup', onUp);
    v.addEventListener('pointercancel', onUp);
    return () => {
      v.removeEventListener('pointerdown', onDown);
      v.removeEventListener('pointermove', onMove);
      v.removeEventListener('pointerup', onUp);
      v.removeEventListener('pointercancel', onUp);
      gsap.killTweensOf([v, w]);
    };
  }, []);

  const modalItem: Parameters<typeof MediaModal>[0]['item'] = !open
    ? null
    : open.kind === 'edit'
      ? open.project
      : open.kind === 'poster'
        ? {
            title: open.poster.title,
            context: 'Poster',
            media: { type: 'image', src: open.poster.src },
            description: 'From the poster archive. Grunge, type and too much halftone.',
            disciplines: ['Poster'],
            year: open.poster.year ?? '',
          }
        : null;

  return (
    <section id="board" aria-labelledby="board-title" className="relative border-t border-line/15 pt-16 md:pt-20">
      <div className="shell flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 id="board-title" className="poster -rotate-1 text-poster-lg">
            The board
          </h2>
          <p className="tw mt-3 text-muted">
            {posters.length} posters · {items.filter((i) => i.kind === 'edit').length} edits · {notes.length} notes ·
            drag to look around
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="tw inline-flex h-11 rotate-1 items-center gap-2 border border-line/40 px-5 transition-colors hover:bg-accent hover:text-accent-ink"
        >
          Shuffle the wall ↻
        </button>
      </div>

      <div className="relative mt-8">
        <div
          ref={view}
          className="no-scrollbar relative h-[78svh] cursor-grab overflow-auto"
          onClickCapture={(e) => {
            if (moved.current) {
              e.stopPropagation();
              e.preventDefault();
            }
          }}
          role="region"
          aria-label="Board of posters, edits and notes. Drag or scroll to pan."
        >
          <div ref={wall} className="relative origin-center" style={{ width: W, height: H }}>
            {items.map((it, i) => (
              <div
                key={it.key}
                className="absolute left-0 top-0 transition-transform duration-[900ms] ease-expo"
                style={{
                  width: it.w,
                  transform: `translate(${pos[i].x}px, ${pos[i].y}px) rotate(${pos[i].rot}deg)`,
                }}
              >
                <Piece item={it} onOpen={() => setOpen(it)} />
              </div>
            ))}
          </div>
        </div>

        {/* Minimap */}
        <div
          className="pointer-events-none absolute bottom-4 right-4 hidden border border-line/40 bg-bg/90 md:block"
          style={{ width: 176, height: (176 * H) / W }}
          aria-hidden
        >
          {items.map((it, i) => (
            <span
              key={it.key}
              className={`absolute ${it.kind === 'note' ? 'bg-accent' : 'bg-fg/50'}`}
              style={{
                left: `${(pos[i].x / W) * 100}%`,
                top: `${(pos[i].y / H) * 100}%`,
                width: `${(it.w / W) * 100}%`,
                height: `${(it.h / H) * 100}%`,
              }}
            />
          ))}
          <div ref={mini} className="absolute left-0 top-0 border border-accent" />
        </div>
      </div>

      <MediaModal item={modalItem} onClose={() => setOpen(null)} />
    </section>
  );
}

function Piece({ item, onOpen }: { item: Item; onOpen: () => void }) {
  if (item.kind === 'note') {
    return (
      <div
        className="bg-[#f1ead7] p-4 text-[#111] shadow-[0_18px_40px_-20px_rgb(0_0_0/0.8)]"
        style={{ minHeight: item.h }}
      >
        <span className="tw block text-[10px] text-[#111]/60">
          {item.note.tag} · {item.note.date}
        </span>
        <span className="poster mt-2 block text-2xl leading-none">{item.note.title}</span>
        <span className="mt-2 block font-type text-[12px] leading-snug">{item.note.text}</span>
      </div>
    );
  }

  const src = item.kind === 'poster' ? item.poster.src : item.project.cover;
  const title = item.kind === 'poster' ? item.poster.title : item.project.title;

  return (
    <button
      type="button"
      onClick={onOpen}
      data-cursor={item.kind === 'edit' ? 'Play' : 'Look'}
      className="group relative block w-full text-left shadow-[0_18px_40px_-20px_rgb(0_0_0/0.9)] transition-transform duration-300 ease-expo hover:z-10 hover:scale-[1.04]"
      style={{ height: item.h }}
    >
      <span className="absolute inset-0 overflow-hidden bg-surface">
        {src && (
          <Image
            src={src}
            alt={title}
            fill
            sizes={`${item.w}px`}
            draggable={false}
            className="pointer-events-none select-none object-cover text-transparent"
          />
        )}
      </span>
      {item.kind === 'edit' && (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-10 text-white">
          <span className="poster block text-xl leading-none">{title}</span>
          <span className="tw mt-1 block text-[10px] text-white/70">{item.project.context}</span>
        </span>
      )}
      {item.kind === 'edit' && item.project.stat && (
        <span className="tw absolute -right-3 -top-3 rotate-6 bg-accent px-2 py-1 text-[11px] text-accent-ink">
          {item.project.stat}
        </span>
      )}
      {item.kind === 'poster' && (
        <span className="tw absolute -bottom-6 left-0 text-[11px] text-muted opacity-0 transition-opacity group-hover:opacity-100">
          {title}
        </span>
      )}
    </button>
  );
}
