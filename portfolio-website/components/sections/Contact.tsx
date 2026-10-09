'use client';

import { useState } from 'react';
import { modeCopy, profile } from '@/content/site';
import { useMode } from '@/components/providers/ModeProvider';
import Reveal from '@/components/ui/Reveal';
import Magnetic from '@/components/ui/Magnetic';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact({ standalone = false }: { standalone?: boolean }) {
  const { mode } = useMode();
  const copy = modeCopy[mode];
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subject: form.subject || `Hello from the ${copy.label.toLowerCase()} side` }),
      });
      if (!res.ok) throw new Error();
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const field =
    'w-full border-b border-line/25 bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-muted/70 focus:border-accent';

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className={`relative ${standalone ? 'pb-24 pt-32 md:pt-44' : 'py-24 md:py-36'}`}
    >
      <div className="shell">
        <span className="label text-muted">Contact</span>
        <h2 id="contact-title" className="display mt-4 text-mega" key={mode}>
          <Reveal as="span" by="chars" className="block">
            {copy.contactTitle[0]}
          </Reveal>
          <Reveal as="span" by="chars" delay={0.1} className="block text-accent">
            {copy.contactTitle[1]}
          </Reveal>
        </h2>

        <div className="mt-14 grid gap-14 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="max-w-[38ch] text-xl leading-snug">{copy.contactIntro}</p>
            <Magnetic className="mt-8 block w-fit" strength={0.2}>
              <button
                type="button"
                onClick={copyEmail}
                data-cursor={copied ? 'Copied!' : 'Copy'}
                className="group text-left"
              >
                <span className="label text-muted">{copied ? 'Copied to clipboard' : 'Email, click to copy'}</span>
                <span className="mt-2 block break-all text-[clamp(1.4rem,2.6vw,2.4rem)] font-semibold leading-tight">
                  <span className="link-underline">{profile.email}</span>
                </span>
              </button>
            </Magnetic>
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3">
              {profile.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between border-b border-line/15 py-2"
                  >
                    <span>{s.label}</span>
                    <span className="transition-transform duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={submit} className="grid gap-6 md:col-span-6 md:col-start-7" aria-describedby="form-status">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="label text-muted">Name</span>
                <input
                  required
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={field}
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="label text-muted">Email</span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={field}
                  placeholder="you@studio.com"
                />
              </label>
            </div>
            <label className="block">
              <span className="label text-muted">Subject</span>
              <input
                name="subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className={field}
                placeholder={mode === 'professional' ? 'Motion design for…' : 'Collab idea / song rec'}
              />
            </label>
            <label className="block">
              <span className="label text-muted">Message</span>
              <textarea
                required
                name="message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${field} resize-none`}
                placeholder="Tell me what you are making"
              />
            </label>
            <div className="flex flex-wrap items-center gap-5">
              <Magnetic>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="label inline-flex h-14 items-center gap-3 rounded-full bg-fg px-8 text-bg transition-colors duration-300 hover:bg-accent hover:text-accent-ink disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending…' : 'Send message'} <span aria-hidden>→</span>
                </button>
              </Magnetic>
              <p id="form-status" role="status" aria-live="polite" className="label text-muted">
                {status === 'sent' && 'Got it. I will reply soon.'}
                {status === 'error' && `That did not send. Email ${profile.email} instead.`}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
