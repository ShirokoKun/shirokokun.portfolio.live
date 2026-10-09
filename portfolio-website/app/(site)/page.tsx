'use client';

import { useMode } from '@/components/providers/ModeProvider';
import ProHero from '@/components/pro/Hero';
import Timeline from '@/components/pro/Timeline';
import RenderSettings from '@/components/pro/RenderSettings';
import ProSignoff from '@/components/pro/Signoff';
import PersonalHero from '@/components/personal/Hero';
import Board from '@/components/personal/Board';
import Receipt from '@/components/personal/Receipt';
import PersonalSignoff from '@/components/personal/Signoff';

/**
 * One URL, two personalities. Professional is a calm edit suite with one
 * timeline that holds the whole career; Personal is a loud board you can
 * throw around. Each is four screens, not fourteen.
 */
export default function Home() {
  const { mode } = useMode();

  return mode === 'professional' ? (
    <div key="pro">
      <ProHero />
      <Timeline />
      <RenderSettings />
      <ProSignoff />
    </div>
  ) : (
    <div key="personal">
      <PersonalHero />
      <Board />
      <Receipt />
      <PersonalSignoff />
    </div>
  );
}
