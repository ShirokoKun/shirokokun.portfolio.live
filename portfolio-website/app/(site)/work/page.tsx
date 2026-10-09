import type { Metadata } from 'next';
import Archive from '@/components/sections/Archive';

export const metadata: Metadata = {
  title: 'Archive',
  description:
    'Every project by Swastik Gupta: motion design, edits, posters and experiments, filterable by side and discipline.',
};

export default function WorkPage() {
  return <Archive />;
}
