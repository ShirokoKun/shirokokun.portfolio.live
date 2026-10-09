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
        sans: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
        display: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-instrument)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        mega: ['clamp(4.5rem, 17vw, 19rem)', { lineHeight: '0.82', letterSpacing: '-0.04em' }],
        huge: ['clamp(2.25rem, 9vw, 9.5rem)', { lineHeight: '0.88', letterSpacing: '-0.035em' }],
        big: ['clamp(2.25rem, 5vw, 5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        quart: 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      keyframes: {
        blink: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.2' } },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '20%': { transform: 'translate(-3%, 2%)' },
          '40%': { transform: 'translate(2%, -3%)' },
          '60%': { transform: 'translate(-2%, -1%)' },
          '80%': { transform: 'translate(3%, 3%)' },
        },
      },
      animation: {
        blink: 'blink 1.4s ease-in-out infinite',
        grain: 'grain 0.9s steps(4) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
