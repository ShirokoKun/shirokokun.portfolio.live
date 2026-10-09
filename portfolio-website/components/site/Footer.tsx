'use client';

import Link from 'next/link';
import { nav, profile } from '@/content/site';
import { useLenis } from '@/components/providers/SmoothScroll';
import { useMode } from '@/components/providers/ModeProvider';
import LocalTime from '@/components/ui/LocalTime';
import Marquee from '@/components/ui/Marquee';

export default function Footer() {
  const lenis = useLenis();
  const { mode, toggle } = useMode();

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden border-t border-line/15 pt-12">
      <div className="shell grid gap-10 pb-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <span className="label text-muted">Local time</span>
          <p className="mt-2 text-2xl font-semibold">
            <LocalTime />
          </p>
          <p className="mt-1 text-muted">{profile.location}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-2">
          <span className="label text-muted">Pages</span>
          <ul className="mt-3 space-y-1.5">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-underline">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3">
          <span className="label text-muted">Elsewhere</span>
          <ul className="mt-3 space-y-1.5">
            {profile.social.slice(0, 4).map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="link-underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-start gap-3 md:col-span-3 md:items-end">
          <button type="button" onClick={toTop} className="label link-underline">
            Back to top ↑
          </button>
          <button
            type="button"
            onClick={(e) => toggle({ x: e.clientX, y: e.clientY })}
            className="label link-underline whitespace-nowrap text-accent"
          >
            See the {mode === 'professional' ? 'personal' : 'professional'} side ⇄
          </button>
        </div>
      </div>

      <Marquee
        items={[profile.name, profile.role, `@${profile.handle}`]}
        separator="●"
        speed={40}
        className="display select-none border-t border-line/15 py-4 text-[clamp(3.5rem,11vw,11rem)] leading-[0.9]"
      />

      <div className="shell label flex flex-wrap justify-between gap-3 border-t border-line/15 py-5 text-muted">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>Press M to switch sides</span>
        <span>Built with Next.js, GSAP & Lenis</span>
      </div>
    </footer>
  );
}
