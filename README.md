# Swastik Gupta, Portfolio

Portfolio of Swastik Gupta (sxk.m4in), motion designer at [IDK Show](https://www.youtube.com/@IDK_Show) and creative generalist.

The site has two sides that share one URL:

- **Professional**: studio work, IDK Show, fests, brands, experience. Bone paper, ink and signal orange.
- **Personal**: music visuals, anime edits, the poster wall, notes, Spotify and Substack. Near black with acid lime.

Flip between them with the toggle in the nav, the link in the footer, or the `M` key. The choice is remembered and shareable as `/?mode=personal`.

## Stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS with CSS variable tokens per mode |
| Motion | GSAP 3.13 (ScrollTrigger, SplitText), Lenis smooth scroll, Framer Motion |
| Type | Archivo (variable width), Instrument Serif, JetBrains Mono via `next/font` |
| Backend | Express service in `portfolio-backend/` (Substack feed and contact form to Google Sheets) |

## Editing content

Almost everything you would want to change lives in one file: [`portfolio-website/content/site.ts`](portfolio-website/content/site.ts).

- `profile`: name, role, emails, résumé link, socials.
- `modeCopy`: every headline and paragraph for each side.
- `projects`: work items. Set `mode` to `professional` or `personal`, `media` to a YouTube id, image or link, and `featured` to pin it to the home page. Items with `placeholder: true` show a "details coming" note.
- `showreel`: the reel that plays from the "Play reel" section on each side.
- `experience`, `journey`, `stats`, `capabilities`, `posters`, `notes`.

Posters live as originals in `portfolio-website/assets/artwork`. After adding one, run `node scripts/optimize-images.cjs` to write the WebP into `public/work/posters`, then add an entry to `posters`.

## Structure

```
portfolio-website/
  app/
    (site)/            home, /work archive, /blog, /contact (shared nav, preloader, footer)
    mindscape/         the node graph page
    api/               YouTube, Spotify, Substack, contact routes
  components/
    providers/         Lenis smooth scroll, mode switch
    site/              nav, footer
    sections/          hero, showreel, work, about, timeline, poster wall, desk, contact, archive
    ui/                cursor, reveal, magnetic, marquee, preloader, media modal, cover
  content/site.ts      all copy and project data
  lib/                 motion helpers, boot scripts
portfolio-backend/     Express API (Railway)
docs/                  older setup notes for Spotify, env vars and deployment
```

## Running locally

```bash
cd portfolio-website
npm install
cp .env.example .env.local   # fill in your own keys
npm run dev                  # http://localhost:3000
```

Useful scripts: `npm run build`, `npm run lint`, `npm run type-check`, `npm run format`.

The backend is optional for local work:

```bash
cd portfolio-backend
npm install
cp .env.example .env
npm run dev                  # http://localhost:8080
```

## Environment variables

Frontend (`portfolio-website/.env.local`):

```env
YOUTUBE_API_KEY=
YOUTUBE_CHANNEL_ID=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_SITE_URL=https://your-domain
```

Backend: see `portfolio-backend/.env.example`. Never commit real keys; the examples only hold placeholders.

## Deployment

- **Frontend**: Vercel, root directory `portfolio-website`, framework Next.js.
- **Backend**: Railway, root directory `portfolio-backend`. See [docs/RAILWAY_DEPLOYMENT.md](docs/RAILWAY_DEPLOYMENT.md).

Old routes keep working: `/projects` redirects to `/work`, `/myspace` opens the personal side.

## Accessibility

Every scroll effect, pin and wipe is skipped when the visitor prefers reduced motion. The custom cursor only appears on fine pointers, there is a skip link, and the mode toggle is a labelled radio group.
