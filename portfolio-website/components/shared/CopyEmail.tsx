'use client';

import { useState } from 'react';
import { profile } from '@/content/site';

/** The email address as one big button: click to copy, falls back to mailto. */
export default function CopyEmail({ className = '', hintClass = '' }: { className?: string; hintClass?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <button type="button" onClick={copy} data-cursor={copied ? 'Copied' : 'Copy'} className="group block text-left">
      <span className={hintClass} aria-live="polite">
        {copied ? 'Copied to clipboard' : 'Email · click to copy'}
      </span>
      <span className={`mt-2 block break-all ${className}`}>
        <span className="link-underline">{profile.email}</span>
      </span>
    </button>
  );
}
