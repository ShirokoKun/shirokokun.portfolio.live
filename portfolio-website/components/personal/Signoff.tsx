'use client';

import Link from 'next/link';
import { modeCopy, profile } from '@/content/site';
import { useMode } from '@/components/providers/ModeProvider';
import CopyEmail from '@/components/shared/CopyEmail';
import LocalTime from '@/components/ui/LocalTime';

const copy = modeCopy.personal;
const TILTS = [-4, 3, -2, 5, -3, 2];

/** Say hi: the sign-off, with socials stuck on like stickers. */
export default function PersonalSignoff() {
  const { toggle } = useMode();

  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-line/15 pt-20 md:pt-28">
      <div className="shell">
        <h2 id="contact-title" className="poster text-poster-xl">
          <span className="block">{copy.signoffTitle[0]}</span>
          <span className="block -rotate-2 text-accent">{copy.signoffTitle[1]}</span>
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <CopyEmail className="font-type text-[clamp(1.25rem,2.6vw,2.25rem)]" hintClass="tw text-muted" />
            <p className="tw mt-6 max-w-[44ch] normal-case text-muted">{copy.signoffIntro}</p>
          </div>
          <ul className="flex flex-wrap content-start gap-3 md:col-span-5">
            {profile.social.map((s, i) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="tw inline-block border border-line/40 px-4 py-2 transition-[transform,background-color,color] duration-300 hover:rotate-0 hover:bg-accent hover:text-accent-ink"
                  style={{ transform: `rotate(${TILTS[i % TILTS.length]}deg)` }}
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="tw inline-block bg-accent px-4 py-2 text-accent-ink"
                style={{ transform: 'rotate(2deg)' }}
              >
                Write a note →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <footer className="shell tw mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-line/15 py-6 text-muted md:mt-28">
        <span>© 2026 {profile.handle}</span>
        <LocalTime />
        <button
          type="button"
          onClick={(e) => toggle({ x: e.clientX, y: e.clientY })}
          className="link-underline uppercase"
        >
          Press M to clock in
        </button>
        <a href="#main" className="link-underline">
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
