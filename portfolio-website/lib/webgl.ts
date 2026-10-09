'use client';

import { useEffect, useState, type RefObject } from 'react';

/** True when the browser can make a WebGL context. Checked once, lazily. */
let cached: boolean | null = null;
export function hasWebGL() {
  if (cached !== null) return cached;
  if (typeof window === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    cached = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    cached = false;
  }
  return cached;
}

/** Whether an element is on screen, so canvases only render while visible. */
export function useInView(ref: RefObject<Element>, rootMargin = '120px') {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

/**
 * Wait for the browser to go idle before mounting heavy scenes, so WebGL never
 * competes with first paint or the hero's entrance.
 */
export function useIdleReady(delay = 400) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let id: number;
    const t = window.setTimeout(() => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
      id = ric(() => setReady(true)) as number;
    }, delay);
    return () => {
      window.clearTimeout(t);
      if (id && window.cancelIdleCallback) window.cancelIdleCallback(id);
    };
  }, [delay]);
  return ready;
}

/** Route remote images through Next's optimiser: same origin (no CORS) and resized for the GPU. */
export const glImage = (src: string, w = 640) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=70`;
