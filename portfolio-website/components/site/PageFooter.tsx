'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { profile } from '@/content/site';
import { useMode } from '@/components/providers/ModeProvider';
import LocalTime from '@/components/ui/LocalTime';

/** A one-line footer for inner pages. The home page ends with its own sign-off instead. */
export default function PageFooter() {
  const pathname = usePathname();
  const { mode } = useMode();
  if (pathname === '/') return null;
  const t = mode === 'professional' ? 'tc' : 'tw';

  return (
    <footer
      className={`shell ${t} flex flex-wrap items-center justify-between gap-4 border-t border-line/15 py-6 text-muted`}
    >
      <span>© 2026 {profile.name}</span>
      <LocalTime />
      <Link href="/" className="link-underline">
        Home
      </Link>
      <a href="#main" className="link-underline">
        Back to top ↑
      </a>
    </footer>
  );
}
