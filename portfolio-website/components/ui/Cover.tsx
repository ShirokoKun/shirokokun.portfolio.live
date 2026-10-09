'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Project } from '@/content/site';

/** Project artwork, or a bold typographic tile when there is no image yet. */
export default function Cover({
  project,
  sizes = '(max-width: 768px) 100vw, 33vw',
  className = '',
  bare = false,
}: {
  project: Pick<Project, 'title' | 'cover' | 'context' | 'year'>;
  sizes?: string;
  className?: string;
  /** Skip the tile's own year and title when the parent already overlays them. */
  bare?: boolean;
}) {
  const [src, setSrc] = useState(project.cover);

  if (!src) {
    return (
      <div className={`relative flex flex-col justify-between overflow-hidden bg-fg p-4 text-bg ${className}`}>
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent" aria-hidden />
        {!bare && (
          <>
            <span className="label relative text-bg/60">{project.year}</span>
            <span className="display relative text-[clamp(1.5rem,3vw,2.75rem)] leading-[0.9]">{project.title}</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-surface ${className}`}>
      <Image
        src={src}
        alt={project.title}
        fill
        sizes={sizes}
        className="object-cover"
        onError={() => {
          // YouTube does not always have a maxres thumbnail; fall back gracefully.
          if (src.includes('maxresdefault')) setSrc(src.replace('maxresdefault', 'hqdefault'));
          else setSrc(undefined);
        }}
      />
    </div>
  );
}
