'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { journey, posters, profile, projects } from '@/content/site';
import { useSpotifyEnhanced } from '@/hooks/useSpotifyEnhanced';

type Post = { title: string; link: string; publishedAt: string };

const edits = projects.filter((p) => p.modes.includes('personal'));
const views = edits.reduce((sum, p) => sum + (p.stat ? parseFloat(p.stat) : 0), 0); // in thousands
const viewsLabel = views >= 1000 ? `${(views / 1000).toFixed(1)}M` : `${views}K`;
const since = Math.min(...journey.map((j) => Number(j.year)));

/** The journey, itemised like a till receipt, next to what's on rotation right now. */
export default function Receipt() {
  const lines = [...journey].sort((a, b) => Number(a.year) - Number(b.year));

  return (
    <section id="receipt" aria-labelledby="receipt-title" className="border-t border-line/15 py-20 md:py-28">
      <div className="shell grid items-start gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <div
            className="mx-auto max-w-[420px] -rotate-2 bg-[#f1ead7] px-6 py-10 font-type text-[13px] leading-relaxed text-[#111] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)]"
            style={{
              // Torn top and bottom edges.
              WebkitMask:
                'conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 16px 100%, conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) 50% / 16px 100%',
              WebkitMaskComposite: 'source-in',
              maskComposite: 'intersect',
            }}
          >
            <h2 id="receipt-title" className="poster text-center text-4xl leading-none">
              sxk.m4in
            </h2>
            <p className="mt-1 text-center uppercase">Itemised since {since}</p>
            <p className="text-center uppercase text-[#111]/60">Terminal 03:00 · {profile.location.split(',')[0]}</p>
            <Rule />
            <ul>
              {lines.map((j) => (
                <li key={`${j.year}-${j.title}`} className="flex gap-3 py-0.5">
                  <span className="shrink-0">{j.year}</span>
                  <span className="min-w-0 flex-1 truncate uppercase">{j.title}</span>
                  <span className="shrink-0">x1</span>
                </li>
              ))}
            </ul>
            <Rule />
            <dl className="grid grid-cols-[1fr_auto] gap-y-0.5 uppercase">
              <dt>Edits on this site</dt>
              <dd>{edits.length}</dd>
              <dt>Posters on this site</dt>
              <dd>{posters.length}</dd>
              <dt>Views, top 3 edits</dt>
              <dd>{viewsLabel}+</dd>
            </dl>
            <Rule />
            <p className="flex justify-between text-lg font-bold uppercase">
              <span>Total</span>
              <span>Too many late nights</span>
            </p>
            <p className="mt-6 text-center uppercase">Thank you. Come back after dark.</p>
            <div
              className="mx-auto mt-4 h-12 w-56"
              aria-hidden
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, #111 0 2px, transparent 2px 4px, #111 4px 5px, transparent 5px 8px, #111 8px 11px, transparent 11px 12px)',
              }}
            />
            <p className="mt-1 text-center text-[11px]">{profile.handle}</p>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <h2 className="poster text-poster-lg">On rotation</h2>
          <NowPlaying />
          <Writing />
        </div>
      </div>
    </section>
  );
}

function Rule() {
  return <div className="my-4 border-t-2 border-dashed border-[#111]/40" aria-hidden />;
}

function NowPlaying() {
  const { track, isLoading } = useSpotifyEnhanced(30000);
  const spotify = profile.social.find((s) => s.label === 'Spotify')?.href;

  return (
    <a
      href={track?.songUrl || spotify}
      target="_blank"
      rel="noreferrer"
      className="group mt-8 flex items-center gap-5 border border-line/25 p-4 transition-colors hover:border-accent"
    >
      <span className="relative h-24 w-24 shrink-0 overflow-hidden bg-surface">
        {track?.albumImageUrl && <Image src={track.albumImageUrl} alt="" fill sizes="96px" className="object-cover" />}
        {/* A spinning record peeking out */}
        <span
          className="absolute -right-6 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full border-[10px] border-[#1d1d1f] bg-accent transition-transform duration-700 ease-expo group-hover:translate-x-3"
          aria-hidden
        />
      </span>
      <span className="min-w-0">
        <span className="tw flex items-center gap-2 text-muted">
          <span className={`h-2 w-2 rounded-full ${track?.isPlaying ? 'animate-blink bg-accent' : 'bg-muted'}`} />
          {isLoading ? 'Tuning in…' : track?.isPlaying ? 'Now playing' : 'Last played'}
          {track?.timeAgo && !track.isPlaying ? ` · ${track.timeAgo}` : ''}
        </span>
        <span className="poster mt-2 block truncate text-3xl leading-none">{track?.title ?? 'Silence, for now'}</span>
        <span className="tw mt-1 block truncate text-muted">{track?.artist ?? 'Spotify is taking a break'}</span>
      </span>
    </a>
  );
}

function Writing() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch('/api/blog/posts')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => alive && setPosts((d.posts ?? []).slice(0, 3)))
      .catch(() => alive && setPosts([]));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <span className="tw text-muted">Latest writing · Substack</span>
        <Link href="/blog" className="tw link-underline">
          All posts →
        </Link>
      </div>
      <ul className="mt-3">
        {posts === null && <li className="tw py-3 text-muted">Loading…</li>}
        {posts?.length === 0 && (
          <li className="py-3 text-muted">
            Posts live on{' '}
            <a
              className="link-underline text-fg"
              href="https://shirokokun.substack.com"
              target="_blank"
              rel="noreferrer"
            >
              shirokokun.substack.com
            </a>
          </li>
        )}
        {posts?.map((p) => (
          <li key={p.link} className="border-b border-line/15">
            <a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-baseline justify-between gap-4 py-3"
            >
              <span className="text-lg font-medium">{p.title}</span>
              <span className="tw shrink-0 text-muted">
                {new Date(p.publishedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
