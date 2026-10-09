'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { notes, profile } from '@/content/site';
import { useSpotifyEnhanced } from '@/hooks/useSpotifyEnhanced';
import Reveal from '@/components/ui/Reveal';

type Post = { title: string; link: string; publishedAt: string; excerpt: string };

/** Personal-mode bento: what's playing, what I'm thinking, what I wrote. */
export default function Desk() {
  return (
    <section id="desk" aria-labelledby="desk-title" className="relative py-24 md:py-36">
      <div className="shell">
        <span className="label text-muted">Live from the desk</span>
        <Reveal as="h2" id="desk-title" by="chars" className="display mt-4 text-huge">
          Right now
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-12 md:gap-5">
          <NowPlaying />
          <div className="rounded-[18px] border border-line/15 p-5 md:col-span-7 md:p-7">
            <div className="flex items-center justify-between">
              <span className="label text-muted">Notes & ideas</span>
              <span className="label text-accent">{notes.length} open tabs</span>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {notes.map((n) => (
                <li
                  key={n.title}
                  className="group rounded-[12px] bg-surface p-4 transition-transform duration-500 ease-expo hover:-translate-y-1 hover:rotate-[-0.6deg]"
                >
                  <div className="flex items-center justify-between">
                    <span className="label rounded-full bg-bg px-2 py-1 text-[10px]">{n.tag}</span>
                    <span className="label text-[10px] text-muted">{n.date}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold group-hover:text-accent">{n.title}</h3>
                  <p className="mt-1 text-sm leading-snug text-muted">{n.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <Writing />
          <a
            href="https://youtube.com/@Shirokokun"
            target="_blank"
            rel="noreferrer"
            data-cursor="Visit"
            className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[18px] bg-accent p-5 text-accent-ink md:col-span-4 md:p-7"
          >
            <span className="label">YouTube</span>
            <span className="display text-[clamp(1.8rem,2.4vw,2.6rem)] leading-[0.9]">
              @Shirokokun
              <span
                className="block font-serif text-2xl normal-case italic tracking-normal"
                style={{ fontVariationSettings: 'normal', fontWeight: 400 }}
              >
                edits since 2021
              </span>
            </span>
            <span className="label flex items-center justify-between">
              Subscribe <span className="transition-transform duration-500 ease-expo group-hover:translate-x-2">→</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function NowPlaying() {
  const { track, isLoading } = useSpotifyEnhanced(30000);
  const hasTrack = !!track?.title;

  return (
    <a
      href={track?.songUrl || profile.social.find((s) => s.label === 'Spotify')?.href}
      target="_blank"
      rel="noreferrer"
      className="group relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[18px] bg-fg p-5 text-bg md:col-span-5 md:p-7"
    >
      {track?.albumImageUrl && (
        <Image
          src={track.albumImageUrl}
          alt=""
          fill
          sizes="40vw"
          className="scale-125 object-cover opacity-30 blur-2xl transition-transform duration-[2s] group-hover:scale-110"
        />
      )}
      <div className="relative flex items-center justify-between">
        <span className="label flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${track?.isPlaying ? 'animate-blink bg-accent' : 'bg-bg/40'}`} />
          {isLoading ? 'Tuning in…' : track?.isPlaying ? 'Now playing on Spotify' : 'Last played on Spotify'}
        </span>
        {track?.timeAgo && <span className="label text-bg/60">{track.timeAgo}</span>}
      </div>

      <div className="relative flex items-end gap-4">
        {track?.albumImageUrl ? (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md md:h-28 md:w-28">
            <Image src={track.albumImageUrl} alt={track.album ?? ''} fill sizes="112px" className="object-cover" />
          </div>
        ) : (
          <div
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md bg-bg/10 md:h-28 md:w-28"
            aria-hidden
          >
            <Bars playing={false} />
          </div>
        )}
        <div className="min-w-0">
          <p className="display truncate text-[clamp(1.6rem,2.6vw,2.4rem)] leading-none">
            {hasTrack ? track!.title : 'Silence (for now)'}
          </p>
          <p className="mt-2 truncate text-bg/70">{hasTrack ? track!.artist : 'Spotify is taking a break.'}</p>
          {track?.isPlaying && (
            <div className="mt-3">
              <Bars playing />
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

function Bars({ playing }: { playing: boolean }) {
  return (
    <span className="flex h-5 items-end gap-[3px]" aria-hidden>
      {[0.6, 1, 0.4, 0.8, 0.5].map((h, i) => (
        <span
          key={i}
          className="w-[3px] origin-bottom rounded-full bg-accent"
          style={{
            height: `${h * 100}%`,
            animation: playing ? `blink ${0.6 + i * 0.13}s ease-in-out infinite` : undefined,
          }}
        />
      ))}
    </span>
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
    <div className="rounded-[18px] border border-line/15 p-5 md:col-span-8 md:p-7">
      <div className="flex items-center justify-between">
        <span className="label text-muted">Latest writing · Substack</span>
        <Link href="/blog" className="label link-underline">
          All posts →
        </Link>
      </div>
      <ul className="mt-4">
        {posts === null &&
          [0, 1, 2].map((i) => (
            <li key={i} className="border-b border-line/10 py-4 last:border-0">
              <div className="h-5 w-2/3 animate-pulse rounded bg-surface" />
            </li>
          ))}
        {posts?.length === 0 && (
          <li className="py-4 text-muted">
            Posts live on{' '}
            <a
              className="link-underline text-fg"
              href="https://shirokokun.substack.com"
              target="_blank"
              rel="noreferrer"
            >
              shirokokun.substack.com
            </a>
            .
          </li>
        )}
        {posts?.map((p) => (
          <li key={p.link} className="border-b border-line/10 last:border-0">
            <a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="group flex items-baseline justify-between gap-4 py-4"
            >
              <span className="text-lg font-medium transition-transform duration-500 ease-expo group-hover:translate-x-2 md:text-xl">
                {p.title}
              </span>
              <span className="label shrink-0 text-muted">
                {new Date(p.publishedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
