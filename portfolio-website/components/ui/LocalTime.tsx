'use client';

import { useEffect, useState } from 'react';
import { profile } from '@/content/site';

/** Live clock in Swastik's timezone, e.g. "21:04:12 IST". */
export default function LocalTime({ className = '', seconds = true }: { className?: string; seconds?: boolean }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: profile.timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: seconds ? '2-digit' : undefined,
      hour12: false,
    });
    const update = () => setNow(fmt.format(new Date()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [seconds]);

  return (
    <span className={`tabular-nums ${className}`} suppressHydrationWarning>
      {now ?? '--:--'} IST
    </span>
  );
}
