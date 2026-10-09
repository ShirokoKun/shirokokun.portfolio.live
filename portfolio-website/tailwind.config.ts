import type { Config } from 'tailwindcss';

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        fg: token('fg'),
        muted: token('muted'),
        line: token('line'),
        surface: token('surface'),
        accent: token('accent'),
        'accent-ink': token('accent-ink'),
      },
      fontFamily: {
        // Professional: a precise grotesk, a timecode mono and a serif voice.
        sans: ['var(--font-inter-tight)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        serif: ['var(--font-instrument)', 'Georgia', 'serif'],
        // Personal: condensed poster caps and a typewriter mono.
        poster: ['var(--font-anton)', 'Impact', 'sans-serif'],
        type: ['var(--font-space-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Professional scale: three steps, mixed case, tight but never touching.
        'pro-hero': ['clamp(3rem, 8.2vw, 9.5rem)', { lineHeight: '0.92', letterSpacing: '-0.05em' }],
        'pro-xl': ['clamp(2.75rem, 6.4vw, 7.25rem)', { lineHeight: '0.94', letterSpacing: '-0.045em' }],
        'pro-lg': ['clamp(2rem, 3.6vw, 3.75rem)', { lineHeight: '1', letterSpacing: '-0.035em' }],
        'pro-md': ['clamp(1.25rem, 1.6vw, 1.625rem)', { lineHeight: '1.25', letterSpacing: '-0.015em' }],
        // Personal scale: poster caps that are meant to be huge.
        'poster-xl': ['clamp(5rem, 19vw, 21rem)', { lineHeight: '0.8', letterSpacing: '-0.01em' }],
        'poster-lg': ['clamp(3rem, 8vw, 8.5rem)', { lineHeight: '0.85', letterSpacing: '0' }],
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        quart: 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      keyframes: {
        blink: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.2' } },
        fadein: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        blink: 'blink 1.4s ease-in-out infinite',
        fadein: 'fadein 1.2s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
