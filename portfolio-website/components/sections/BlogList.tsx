'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { EASE_EXPO } from '@/lib/motion';
import { useMode } from '@/components/providers/ModeProvider';

type Post = { title: string; link: string; publishedAt: string; excerpt: string; tags?: string[] };

const SUBSTACK = 'https://shirokokun.substack.com';

/** Substack posts as an editorial index. */
export default function BlogList() {
  const pro = useMode().mode === 'professional';
  const L = pro ? 'tc' : 'tw';
  const H1 = pro ? 'text-pro-xl font-semibold' : 'poster text-poster-lg';
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch('/api/blog/posts')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => alive && setPosts(d.posts ?? []))
      .catch(() => {
        if (!alive) return;
        setFailed(true);
        setPosts([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="pb-24 pt-28 md:pb-32 md:pt-36">
      <div className="shell">
        <span className={`${L} text-muted`}>Notes from the timeline</span>
        <h1 className={`mt-4 ${H1}`}>Writing</h1>
        <p className="mt-8 max-w-[46ch] text-xl leading-snug">
          Thoughts on design, editing, technology and whatever else I cannot stop thinking about. Published on{' '}
          <a href={SUBSTACK} target="_blank" rel="noreferrer" className="link-underline text-accent">
            Substack
          </a>
          .
        </p>

        <ul className="mt-16 border-t border-line/15">
          {posts === null &&
            [0, 1, 2, 3].map((i) => (
              <li key={i} className="grid gap-3 border-b border-line/15 py-8 md:grid-cols-12">
                <div className="h-3 w-20 animate-pulse rounded bg-surface md:col-span-2" />
                <div className="h-8 w-3/4 animate-pulse rounded bg-surface md:col-span-6" />
              </li>
            ))}

          {posts?.length === 0 && (
            <li className="py-10 text-xl text-muted">
              {failed ? 'Could not reach Substack right now. ' : 'Nothing here yet. '}
              Read everything at{' '}
              <a href={SUBSTACK} target="_blank" rel="noreferrer" className="link-underline text-fg">
                shirokokun.substack.com
              </a>
              .
            </li>
          )}

          {posts?.map((p, i) => (
            <motion.li
              key={p.link}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.9, ease: EASE_EXPO, delay: Math.min(i, 5) * 0.05 }}
              className="border-b border-line/15"
            >
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                data-cursor="Read"
                className="group grid gap-3 py-8 md:grid-cols-12 md:gap-6"
              >
                <span className={`${L} pt-2 text-muted md:col-span-2`}>
                  {new Date(p.publishedAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <h2
                  className={`${pro ? 'text-pro-lg font-semibold' : 'poster text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[0.95]'} transition-colors duration-300 group-hover:text-accent md:col-span-6`}
                >
                  {p.title}
                </h2>
                <p className="line-clamp-3 text-muted md:col-span-4">{p.excerpt}</p>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
