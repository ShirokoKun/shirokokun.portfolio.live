'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { projects, type Project } from '@/content/site';
import { useMode } from '@/components/providers/ModeProvider';
import { EASE_EXPO } from '@/lib/motion';
import Cover from '@/components/ui/Cover';
import MediaModal from '@/components/ui/MediaModal';

type Scope = 'professional' | 'personal' | 'all';

/** Every project on one filterable page. */
export default function Archive() {
  const { mode } = useMode();
  const pro = mode === 'professional';
  const L = pro ? 'tc' : 'tw';
  const H1 = pro ? 'text-pro-xl font-semibold' : 'poster text-poster-lg';
  const [scope, setScope] = useState<Scope>(mode);
  const [tag, setTag] = useState('All');
  const [active, setActive] = useState<Project | null>(null);

  useEffect(() => {
    setScope(mode);
    setTag('All');
  }, [mode]);

  const inScope = useMemo(() => projects.filter((p) => scope === 'all' || p.modes.includes(scope)), [scope]);
  const tags = useMemo(() => ['All', ...Array.from(new Set(inScope.flatMap((p) => p.disciplines)))], [inScope]);
  const shown = tag === 'All' ? inScope : inScope.filter((p) => p.disciplines.includes(tag));

  return (
    <section className="pb-24 pt-28 md:pb-32 md:pt-36">
      <div className="shell">
        <span className={`${L} text-muted`}>({String(projects.length).padStart(2, '0')}) Everything</span>
        <h1 className={`mt-4 ${H1}`}>Archive</h1>

        <div className="mt-12 flex flex-col gap-4 border-y border-line/15 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Which side">
            {(['professional', 'personal', 'all'] as Scope[]).map((s) => (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={scope === s}
                onClick={() => {
                  setScope(s);
                  setTag('All');
                }}
                className={`${L} rounded-full px-4 py-2.5 transition-colors ${
                  scope === s ? 'bg-fg text-bg' : 'border border-line/20 hover:border-fg'
                }`}
              >
                {s === 'all' ? 'Both sides' : s}
              </button>
            ))}
          </div>
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:justify-end md:px-0">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                aria-pressed={tag === t}
                className={`${L} shrink-0 rounded-full px-3 py-2 transition-colors ${
                  tag === t ? 'bg-accent text-accent-ink' : 'text-muted hover:text-fg'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <motion.ul layout className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.7, ease: EASE_EXPO, delay: Math.min(i, 8) * 0.04 }}
              >
                <button
                  type="button"
                  onClick={() => setActive(p)}
                  data-cursor={p.media.type === 'youtube' ? 'Play' : p.media.type === 'image' ? 'View' : 'Open'}
                  className="group block w-full text-left"
                >
                  <div className="overflow-hidden rounded-sm">
                    <Cover
                      project={p}
                      className="aspect-[4/3] w-full transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold leading-tight transition-colors group-hover:text-accent">
                        {p.title}
                      </h2>
                      <p className="mt-1 text-muted">{p.context}</p>
                    </div>
                    <span className={`${L} shrink-0 pt-1 text-muted`}>{p.year}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.disciplines.map((d) => (
                      <span key={d} className={`${L} rounded-full border border-line/15 px-2 py-1 text-muted`}>
                        {d}
                      </span>
                    ))}
                    {p.stat && <span className={`${L} bg-accent px-2 py-1 text-accent-ink`}>{p.stat}</span>}
                  </div>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
      <MediaModal item={active} onClose={() => setActive(null)} />
    </section>
  );
}
