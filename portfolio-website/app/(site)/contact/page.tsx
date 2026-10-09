import type { Metadata } from 'next';
import ContactPage from '@/components/sections/ContactPage';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Swastik Gupta for motion design, edits and collaborations.',
};

export default function Page() {
  return <ContactPage />;
}
