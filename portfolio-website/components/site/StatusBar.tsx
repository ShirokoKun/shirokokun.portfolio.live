'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { nav, profile } from '@/content/site';
import { useMode } from '@/components/providers/ModeProvider';
import ModeToggle from '@/components/ui/ModeToggle';
import LocalTime from '@/components/ui/LocalTime';

/**
 * One slim fixed bar for both sides. Solid background (no backdrop blur, which
 * repaints under moving content), so it costs nothing while scrolling.
 */
export default function StatusBar() {
  const { mode } = useMode();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const pro = mode === 'professional';

  useEffect(() => setOpen(false), [pathname, mode]);

  return (
    <>
      <a
        href="#main"
        className="tc fixed left-4 top-4 z-[80] -translate-y-20 bg-accent px-4 py-3 text-accent-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-[70] border-b border-line/15 bg-bg">
        <div className="shell flex h-12 items-center justify-between gap-4 md:h-14">
          <Link href="/" aria-label={`${profile.name}, home`} className="flex min-w-0 items-center gap-3">
            {pro ? (
              <>
                <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />
                <span className="whitespace-nowrap text-[15px] font-semibold tracking-[-0.01em]">{profile.name}</span>
                <span className="tc hidden text-muted lg:inline">{profile.role}</span>
              </>
            ) : (
              <span className="poster text-[22px] leading-none">
                sxk<span className="text-accent">.</span>m4in
              </span>
            )}
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-6">
              {nav[mode].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`${pro ? 'text-[14px] font-medium' : 'tw'} link-underline`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <LocalTime seconds={false} className={`${pro ? 'tc' : 'tw'} hidden text-muted lg:inline`} />
            <ModeToggle />
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="menu"
              className={`${pro ? 'tc' : 'tw'} h-9 border border-line/25 px-3 md:hidden`}
            >
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
        {open && (
          <nav id="menu" aria-label="Mobile" className="shell border-t border-line/15 pb-6 md:hidden">
            <ul>
              {nav[mode].map((item) => (
                <li key={item.href} className="border-b border-line/10">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block py-3 ${pro ? 'text-pro-lg font-medium' : 'poster text-[3rem] leading-none'}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
