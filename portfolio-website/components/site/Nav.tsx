'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { nav, profile } from '@/content/site';
import ModeToggle from '@/components/ui/ModeToggle';
import LocalTime from '@/components/ui/LocalTime';
import { useLenis } from '@/components/providers/SmoothScroll';
import { EASE_EXPO, EASE_QUART } from '@/lib/motion';

export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 200 && y > last + 2 ? true : y < last - 2 ? false : (h) => h);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }, [open, lenis]);

  return (
    <>
      <a
        href="#main"
        className="label fixed left-4 top-4 z-[80] -translate-y-20 rounded-full bg-accent px-4 py-3 text-accent-ink focus:translate-y-0"
      >
        Skip to content
      </a>

      <motion.header
        className="fixed inset-x-0 top-0 z-[70]"
        animate={{ y: hidden && !open ? '-110%' : '0%' }}
        transition={{ duration: 0.6, ease: EASE_EXPO }}
      >
        <div
          className={`shell flex items-center justify-between gap-4 py-3 transition-[background-color,border-color] duration-500 md:py-4 ${
            scrolled && !open ? 'border-b border-line/10 bg-bg/80 backdrop-blur-md' : 'border-b border-transparent'
          }`}
        >
          <Link href="/" className="group flex items-center gap-3" aria-label={`${profile.name}, home`}>
            <span className="display flex h-9 w-9 items-center justify-center rounded-full bg-fg text-[13px] text-bg transition-transform duration-500 ease-expo group-hover:rotate-[-12deg] group-hover:bg-accent group-hover:text-accent-ink">
              SG
            </span>
            <span className="hidden flex-col sm:flex">
              <span className="text-sm font-semibold leading-tight">{profile.name}</span>
              <span className="label text-[10px] text-muted">{profile.role}</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {nav.map((item, i) => (
                <li key={item.href}>
                  <Link href={item.href} className="group flex items-baseline gap-1.5 text-sm font-medium">
                    <span className="label text-[9px] text-muted">0{i + 1}</span>
                    <span className="link-underline">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <span className="label hidden text-muted xl:inline">
              <LocalTime seconds={false} />
            </span>
            <ModeToggle className="hidden sm:inline-flex" />
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="label flex h-10 items-center gap-2 rounded-full border border-line/20 px-4 lg:hidden"
            >
              <span className="relative block h-2 w-4">
                <span
                  className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-500 ease-expo ${
                    open ? 'translate-y-1 rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-px w-4 bg-current transition-transform duration-500 ease-expo ${
                    open ? '-translate-y-1 -rotate-45' : ''
                  }`}
                />
              </span>
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[65] flex flex-col bg-bg pt-24"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.8, ease: EASE_QUART }}
          >
            <nav aria-label="Mobile" className="shell flex-1">
              <ul className="flex flex-col">
                {nav.map((item, i) => (
                  <li key={item.href} className="overflow-hidden border-b border-line/10">
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: '0%' }}
                      transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.2 + i * 0.06 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="display flex items-baseline justify-between py-3 text-[clamp(2.5rem,11vw,5rem)] leading-none"
                      >
                        {item.label}
                        <span className="label text-muted">0{i + 1}</span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="shell flex flex-col gap-6 pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ModeToggle size="lg" className="self-start" />
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {profile.social.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="label link-underline">
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
