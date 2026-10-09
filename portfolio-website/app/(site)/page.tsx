'use client';

import { modeCopy } from '@/content/site';
import { useMode } from '@/components/providers/ModeProvider';
import Hero from '@/components/sections/Hero';
import Showreel from '@/components/sections/Showreel';
import Work from '@/components/sections/Work';
import About from '@/components/sections/About';
import Timeline from '@/components/sections/Timeline';
import PosterWall from '@/components/sections/PosterWall';
import Desk from '@/components/sections/Desk';
import Contact from '@/components/sections/Contact';
import Marquee from '@/components/ui/Marquee';

/**
 * One page, two sites. Professional reads like a studio index; Personal is a
 * louder sketchbook with posters and what's on the desk. Keying the tree by
 * mode remounts every section so their scroll animations rebuild cleanly.
 */
export default function Home() {
  const { mode } = useMode();
  const copy = modeCopy[mode];

  return (
    <div key={mode}>
      <Hero />
      <Marquee
        items={copy.marquee}
        className="display border-y border-line/15 py-5 text-[clamp(2.25rem,6vw,5.5rem)] leading-none"
      />
      <Showreel />
      <Work limit={mode === 'professional' ? 8 : 9} />
      {mode === 'personal' && <PosterWall />}
      <About />
      <Timeline />
      {mode === 'personal' && <Desk />}
      <Contact />
    </div>
  );
}
