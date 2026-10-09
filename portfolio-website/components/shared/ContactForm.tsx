'use client';

import { useState } from 'react';
import { profile } from '@/content/site';
import { useMode } from '@/components/providers/ModeProvider';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/** Posts to the existing /api/contact route. Styled to match whichever side is active. */
export default function ContactForm() {
  const { mode } = useMode();
  const pro = mode === 'professional';
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subject: form.subject || `Hello from the ${mode} side` }),
      });
      if (!res.ok) throw new Error();
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const label = pro ? 'tc text-muted' : 'tw text-muted';
  const field = `mt-2 w-full border-b border-line/30 bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-muted focus:border-accent ${
    pro ? '' : 'font-type'
  }`;

  return (
    <form onSubmit={submit} className="grid gap-7" aria-describedby="form-status">
      <div className="grid gap-7 sm:grid-cols-2">
        <label className="block">
          <span className={label}>Name</span>
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
          <span className={label}>Email</span>
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
        <span className={label}>Subject</span>
        <input
          name="subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className={field}
          placeholder={pro ? 'Motion design for…' : 'Collab idea or a song rec'}
        />
      </label>
      <label className="block">
        <span className={label}>Message</span>
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
        <button
          type="submit"
          disabled={status === 'sending'}
          className={`${
            pro ? 'tc rounded-full' : 'tw'
          } inline-flex h-12 items-center gap-3 bg-fg px-6 text-bg transition-colors hover:bg-accent hover:text-accent-ink disabled:opacity-60`}
        >
          {status === 'sending' ? 'Sending…' : 'Send message'} <span aria-hidden>→</span>
        </button>
        <p id="form-status" role="status" aria-live="polite" className={label}>
          {status === 'sent' && 'Got it. I will reply soon.'}
          {status === 'error' && `That did not send. Email ${profile.email} instead.`}
        </p>
      </div>
    </form>
  );
}
