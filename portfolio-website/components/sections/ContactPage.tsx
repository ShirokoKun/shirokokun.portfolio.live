'use client';

import { profile } from '@/content/site';
import { useMode } from '@/components/providers/ModeProvider';
import ContactForm from '@/components/shared/ContactForm';
import CopyEmail from '@/components/shared/CopyEmail';

/** The standalone contact page: the form, plus the email for people who would rather write directly. */
export default function ContactPage() {
  const pro = useMode().mode === 'professional';

  return (
    <section className="pb-24 pt-28 md:pb-32 md:pt-36">
      <div className="shell grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className={pro ? 'tc text-muted' : 'tw text-muted'}>Contact</p>
          <h1 className={`mt-4 ${pro ? 'text-pro-xl font-semibold' : 'poster text-poster-lg'}`}>
            {pro ? 'Write to me.' : 'Leave a note.'}
          </h1>
          <div className="mt-10">
            <CopyEmail
              className={pro ? 'text-pro-md font-medium' : 'font-type text-lg'}
              hintClass={pro ? 'tc text-muted' : 'tw text-muted'}
            />
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
            {profile.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className={`${pro ? 'tc' : 'tw'} link-underline`}>
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
