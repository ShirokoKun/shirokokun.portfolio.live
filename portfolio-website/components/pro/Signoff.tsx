'use client';

import Link from 'next/link';
import { modeCopy, profile } from '@/content/site';
import { useMode } from '@/components/providers/ModeProvider';
import CopyEmail from '@/components/shared/CopyEmail';
import LocalTime from '@/components/ui/LocalTime';

const copy = modeCopy.professional;

/** Contact and footer in one screen: the end card. */
export default function ProSignoff() {
  const { toggle } = useMode();

  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-line/15 pt-20 md:pt-28">
      <div className="shell">
        <p className="tc text-muted">Contact</p>
        <h2 id="contact-title" className="mt-4 max-w-[14ch] text-pro-xl font-semibold">
          {copy.signoffTitle}
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <CopyEmail className="text-pro-lg font-medium" hintClass="tc text-muted" />
            <p className="mt-6 max-w-[44ch] text-pro-md text-muted">{copy.signoffIntro}</p>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <ul className="grid grid-cols-2 gap-x-6">
              {profile.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between border-b border-line/15 py-2.5 text-[15px] font-medium transition-colors hover:text-accent"
                  >
                    {s.label} <span aria-hidden>↗</span>
                  </a>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="tc link-underline mt-6 inline-block">
              Prefer a form? →
            </Link>
          </div>
        </div>
      </div>

      <footer className="shell tc mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-line/15 py-6 text-muted md:mt-28">
        <span>© 2026 {profile.name}</span>
        <LocalTime />
        <button
          type="button"
          onClick={(e) => toggle({ x: e.clientX, y: e.clientY })}
          className="link-underline uppercase"
        >
          Press M for after hours
        </button>
        <a href="#main" className="link-underline">
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
