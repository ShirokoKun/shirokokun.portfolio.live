import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Archivo, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import SmoothScroll from '@/components/providers/SmoothScroll';
import ModeProvider from '@/components/providers/ModeProvider';
import { modeBootScript, preloaderBootScript } from '@/lib/boot';
import Cursor from '@/components/ui/Cursor';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';
import { profile } from '@/content/site';

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' });
const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
});
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://swastikgupta.dev';
const title = `${profile.name} | Motion Designer & Creative Generalist`;
const description =
  'Portfolio of Swastik Gupta, motion designer at IDK Show and creative generalist: motion graphics, video editing, posters, identities and interfaces. Switch between the professional and personal sides.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s | ${profile.name}` },
  description,
  keywords: [
    'motion designer',
    'motion graphics',
    'video editor',
    'creative generalist',
    'graphic design',
    'posters',
    'IDK Show',
    'Bhubaneswar',
    'Swastik Gupta',
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: { type: 'website', locale: 'en_US', url: SITE_URL, title, description, siteName: profile.name },
  twitter: { card: 'summary_large_image', title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ECE9E2' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0B' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-mode="professional"
      className={`${archivo.variable} ${instrument.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeBootScript + preloaderBootScript }} />
      </head>
      <body>
        <ErrorBoundaryWrapper>
          <SmoothScroll>
            <ModeProvider>
              {children}
              <Cursor />
            </ModeProvider>
          </SmoothScroll>
        </ErrorBoundaryWrapper>
        <div className="grain animate-grain" aria-hidden />
      </body>
    </html>
  );
}
