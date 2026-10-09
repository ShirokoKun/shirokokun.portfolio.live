'use client';

import Image from 'next/image';
import { useCallback, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  experience,
  projects,
  tracks,
  TIMELINE_END,
  TIMELINE_START,
  type Project,
  type TimelineItem,
  type Track,
} from '@/content/site';
import MediaModal from '@/components/ui/MediaModal';

type Clip = {
  id: string;
  track: Track;
  title: string;
  sub: string;
  start: number;
  end: number;
  lane: number;
  project?: Project;
  role?: TimelineItem;
};

const YEARS = Array.from({ length: TIMELINE_END - TIMELINE_START + 1 }, (_, i) => TIMELINE_START + i);
const SPAN = YEARS.length;
const LANE_H = 40;

const pct = (n: number) => `${(n / SPAN) * 100}%`;
const yearsLabel = (c: Clip) =>
  c.start === c.end ? (c.end === TIMELINE_END && c.role?.current ? 'Now' : String(c.start)) : `${c.start}–${c.end}`;

/** Stack overlapping clips into lanes, like an NLE does when clips collide on a track. */
function pack(items: Omit<Clip, 'lane'>[]): Clip[] {
  const sorted = [...items].sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));
  const laneEnds: number[] = [];
  return sorted.map((c) => {
    let lane = laneEnds.findIndex((end) => end < c.start);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = c.end;
    return { ...c, lane };
  });
}

function buildClips() {
  const work = projects
    .filter((p) => p.modes.includes('professional') && p.track && p.span)
    .map((p) => ({
      id: p.id,
      track: p.track!,
      title: p.title,
      sub: p.context,
      start: p.span![0],
      end: p.span![1],
      project: p,
    }));
  const roles = experience
    .filter((r) => r.span)
    .map((r) => ({
      id: `role-${r.org}`,
      track: 'roles' as Track,
      title: r.org,
      sub: r.title,
      start: r.span![0],
      end: r.span![1],
      role: r,
    }));
  const byTrack = Object.fromEntries(
    tracks.map((t) => [t.id, pack([...work, ...roles].filter((c) => c.track === t.id))])
  ) as Record<Track, Clip[]>;
  return byTrack;
}

const CLIP_STYLE: Record<Track, string> = {
  motion: 'bg-accent text-accent-ink',
  design: 'bg-fg text-bg',
  roles:
    'border border-fg/40 text-fg bg-[repeating-linear-gradient(135deg,rgb(var(--fg)/0.07)_0_6px,transparent_6px_12px)]',
};

/**
 * The professional side's one information system: every project and role on
 * an edit timeline. Hover or focus a clip to load it in the monitor, click to
 * open it. J / L step between clips and K opens the current one.
 */
export default function Timeline() {
  const byTrack = useMemo(buildClips, []);
  const ordered = useMemo(
    () =>
      tracks
        .flatMap((t) => byTrack[t.id])
        .sort((a, b) => b.end - a.end || a.start - b.start || a.track.localeCompare(b.track)),
    [byTrack]
  );
  const [activeId, setActiveId] = useState(ordered[0]?.id);
  const [solo, setSolo] = useState<Track | null>(null);
  const [open, setOpen] = useState<Project | null>(null);
  const active = ordered.find((c) => c.id === activeId) ?? ordered[0];

  const lanesArea = useRef<HTMLDivElement>(null);
  const playhead = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);

  const movePlayhead = useCallback((clientX: number) => {
    const area = lanesArea.current;
    if (!area || !playhead.current) return;
    const r = area.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - r.left, 0), r.width);
    playhead.current.style.transform = `translateX(${x}px)`;
    if (readout.current) {
      const t = TIMELINE_START + (x / r.width) * SPAN;
      const year = Math.min(Math.floor(t), TIMELINE_END);
      const month = Math.min(Math.floor((t - Math.floor(t)) * 12) + 1, 12);
      readout.current.textContent = `${year}:${String(month).padStart(2, '0')}`;
    }
  }, []);

  const parkPlayhead = useCallback(
    (c: Clip) => {
      const area = lanesArea.current;
      if (!area) return;
      const r = area.getBoundingClientRect();
      movePlayhead(r.left + ((c.start - TIMELINE_START) / SPAN) * r.width + 1);
    },
    [movePlayhead]
  );

  // Roles have nothing more to show than the inspector; projects open their media.
  const openClip = (c: Clip) => {
    if (!c.project) return;
    if (c.project.media.type === 'link' && !c.project.placeholder) {
      window.open(c.project.media.href, '_blank', 'noopener');
      return;
    }
    setOpen(c.project);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const i = ordered.findIndex((c) => c.id === active?.id);
    if (e.key === 'l' || e.key === 'L' || e.key === 'ArrowRight') {
      const next = ordered[Math.max(i - 1, 0)];
      setActiveId(next.id);
      parkPlayhead(next);
    } else if (e.key === 'j' || e.key === 'J' || e.key === 'ArrowLeft') {
      const prev = ordered[Math.min(i + 1, ordered.length - 1)];
      setActiveId(prev.id);
      parkPlayhead(prev);
    } else if ((e.key === 'k' || e.key === 'K') && active) {
      openClip(active);
    } else return;
    e.preventDefault();
  };

  const workCount = ordered.filter((c) => c.project).length;
  const roleCount = ordered.length - workCount;

  return (
    <section id="timeline" aria-labelledby="timeline-title" className="border-t border-line/15 py-20 md:py-28">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="tc text-muted">
              Timeline · {workCount} projects · {roleCount} roles
            </p>
            <h2 id="timeline-title" className="mt-4 text-pro-lg font-semibold">
              Eight years, one timeline.
            </h2>
          </div>
          <p className="tc hidden text-muted md:block">Hover to preview · Click to open · J / K / L to scrub</p>
        </div>

        {/* Monitor + inspector */}
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <div className="relative aspect-video overflow-hidden bg-[#121212] text-[#EEECE7] lg:col-span-7">
            <AnimatePresence initial={false}>
              {active && (
                <motion.div
                  key={active.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {active.project?.cover ? (
                    <Image
                      src={active.project.cover}
                      alt={active.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover"
                    />
                  ) : (
                    <Slate clip={active} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="tc pointer-events-none absolute inset-x-0 top-0 flex justify-between p-3 text-[#EEECE7]">
              <span className="bg-[#121212]/80 px-1.5 py-1">PGM</span>
              <span className="bg-[#121212]/80 px-1.5 py-1">{active && yearsLabel(active)}</span>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-5">
            <p className="tc text-muted">
              {tracks.find((t) => t.id === active?.track)?.code} · {tracks.find((t) => t.id === active?.track)?.label}
            </p>
            <h3 className="mt-3 text-pro-lg font-semibold">{active?.title}</h3>
            <p className="mt-2 font-serif text-2xl italic text-muted">{active?.sub}</p>
            <dl className="mt-6 grid grid-cols-[7rem_1fr] gap-y-2 border-t border-line/15 pt-4 text-[15px]">
              <dt className="tc pt-0.5 text-muted">Years</dt>
              <dd>{active && yearsLabel(active)}</dd>
              {active?.project && (
                <>
                  <dt className="tc pt-0.5 text-muted">Discipline</dt>
                  <dd>{active.project.disciplines.join(', ')}</dd>
                </>
              )}
            </dl>
            <p className="mt-4 max-w-[48ch] text-muted">{active?.project?.description ?? active?.role?.note}</p>
            {active?.project?.placeholder && (
              <p className="tc mt-4 border-l-2 border-accent pl-3 text-muted">Case study in the edit</p>
            )}
            {active?.project && (
              <button
                type="button"
                onClick={() => openClip(active)}
                className="tc mt-auto inline-flex h-11 w-fit items-center gap-2 self-start rounded-full bg-fg px-5 text-bg transition-colors hover:bg-accent hover:text-accent-ink max-lg:mt-6"
              >
                {active.project.media.type === 'youtube'
                  ? 'Play ▶'
                  : active.project.media.type === 'image'
                    ? 'View full size'
                    : 'Open ↗'}
              </button>
            )}
          </div>
        </div>

        {/* The timeline itself */}
        <div className="mt-10 overflow-x-auto border border-line/20" onKeyDown={onKey}>
          <div className="min-w-[780px]">
            {/* Ruler */}
            <div className="flex border-b border-line/20">
              <div className="tc flex w-40 shrink-0 items-center border-r border-line/20 px-3 text-muted">
                <span ref={readout} className="tabular-nums">
                  {TIMELINE_END}:01
                </span>
              </div>
              <div className="relative flex h-9 flex-1">
                {YEARS.map((y) => (
                  <div
                    key={y}
                    className="tc relative flex-1 border-l border-line/15 pl-2 pt-3 text-muted first:border-l-0"
                  >
                    {y === TIMELINE_END ? 'Now' : y}
                  </div>
                ))}
              </div>
            </div>

            {/* Tracks */}
            <div className="relative">
              {tracks.map((t) => {
                const clips = byTrack[t.id];
                const lanes = Math.max(1, ...clips.map((c) => c.lane + 1));
                const dim = solo && solo !== t.id;
                return (
                  <div key={t.id} className="flex border-b border-line/15 last:border-b-0">
                    <div className="flex w-40 shrink-0 items-center justify-between gap-2 border-r border-line/20 px-3">
                      <span className="text-[14px] font-medium">
                        <span className="tc mr-2 text-muted">{t.code}</span>
                        {t.label}
                      </span>
                      <button
                        type="button"
                        aria-pressed={solo === t.id}
                        aria-label={`Solo ${t.label}`}
                        onClick={() => setSolo((s) => (s === t.id ? null : t.id))}
                        className={`tc h-6 w-6 shrink-0 border text-[11px] transition-colors ${
                          solo === t.id ? 'border-accent bg-accent text-accent-ink' : 'border-line/30 hover:border-fg'
                        }`}
                      >
                        S
                      </button>
                    </div>
                    <div
                      ref={t.id === tracks[0].id ? lanesArea : undefined}
                      className={`relative flex-1 transition-opacity duration-300 ${dim ? 'opacity-25' : ''}`}
                      style={{ height: lanes * LANE_H + 12 }}
                      onPointerMove={(e) => movePlayhead(e.clientX)}
                    >
                      {/* Year grid */}
                      {YEARS.slice(1).map((y, i) => (
                        <span
                          key={y}
                          className="absolute inset-y-0 w-px bg-line/10"
                          style={{ left: pct(i + 1) }}
                          aria-hidden
                        />
                      ))}
                      {clips.map((c) => {
                        const isActive = c.id === active?.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onPointerEnter={() => setActiveId(c.id)}
                            onFocus={() => {
                              setActiveId(c.id);
                              parkPlayhead(c);
                            }}
                            onClick={() => openClip(c)}
                            aria-label={`${c.title}, ${c.sub}, ${yearsLabel(c)}`}
                            className={`absolute flex flex-col justify-center overflow-hidden px-2 text-left transition-[box-shadow,transform] duration-200 ${
                              CLIP_STYLE[c.track]
                            } ${isActive ? 'z-10 shadow-[0_0_0_2px_rgb(var(--bg)),0_0_0_4px_rgb(var(--accent))]' : 'hover:-translate-y-px'}`}
                            style={{
                              left: `calc(${pct(c.start - TIMELINE_START)} + 2px)`,
                              width: `calc(${pct(c.end - c.start + 1)} - 4px)`,
                              top: 6 + c.lane * LANE_H,
                              height: LANE_H - 6,
                            }}
                          >
                            <span className="truncate text-[13px] font-semibold leading-tight">{c.title}</span>
                            <span className="truncate text-[11px] leading-tight opacity-75">{c.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Playhead, positioned over the clip area only */}
              <div className="pointer-events-none absolute inset-y-0 left-36 right-0" aria-hidden>
                <div ref={playhead} className="absolute inset-y-0 left-0 w-px bg-accent will-change-transform">
                  <span className="absolute -left-[5px] -top-[5px] h-[11px] w-[11px] rotate-45 bg-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MediaModal item={open} onClose={() => setOpen(null)} />
    </section>
  );
}

/** A clapperboard slate for work that has no picture yet. */
function Slate({ clip }: { clip: Clip }) {
  const track = tracks.find((t) => t.id === clip.track);
  return (
    <div className="absolute inset-0 flex flex-col">
      <div
        className="h-[14%] w-full"
        style={{
          backgroundImage: 'repeating-linear-gradient(-55deg, #EEECE7 0 28px, #121212 28px 56px)',
        }}
        aria-hidden
      />
      <div className="grid flex-1 grid-cols-3 grid-rows-[1.4fr_1fr_1fr] border-t-2 border-[#EEECE7]/80">
        <div className="col-span-3 flex flex-col justify-center border-b border-[#EEECE7]/30 px-5">
          <span className="tc text-[#EEECE7]/60">Prod.</span>
          <span className="mt-1 truncate text-[clamp(1.5rem,3vw,2.75rem)] font-semibold tracking-[-0.03em]">
            {clip.title}
          </span>
        </div>
        {[
          ['Roll', track?.code ?? ''],
          ['Scene', yearsLabel(clip)],
          ['Take', '01'],
          ['Track', track?.label ?? ''],
          ['Role', clip.role ? clip.role.title : (clip.project?.disciplines[0] ?? '')],
          ['Status', clip.project?.placeholder ? 'In the edit' : clip.role?.current ? 'Current' : 'Wrapped'],
        ].map(([k, v], i) => (
          <div
            key={k}
            className={`flex flex-col justify-center border-[#EEECE7]/30 px-5 ${i % 3 !== 2 ? 'border-r' : ''} ${
              i < 3 ? 'border-b' : ''
            }`}
          >
            <span className="tc text-[#EEECE7]/60">{k}</span>
            <span className="mt-1 truncate text-[15px] font-medium">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
