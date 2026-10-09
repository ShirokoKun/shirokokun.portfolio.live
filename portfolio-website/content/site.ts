/**
 * Single source of truth for everything the site says.
 *
 * Every page reads from here, so updating the portfolio means editing this file only.
 * Items tagged with `modes` show up in the Professional view, the Personal view, or both.
 *
 * Anything marked `placeholder: true` is a slot waiting for real content and renders
 * with a visible "coming soon" treatment until it is filled in.
 */

export type Mode = 'professional' | 'personal';
export const MODES: Mode[] = ['professional', 'personal'];

export const profile = {
  name: 'Swastik Gupta',
  firstName: 'Swastik',
  lastName: 'Gupta',
  handle: 'sxk.m4in',
  role: 'Motion Designer & Creative Generalist',
  location: 'Bhubaneswar, India',
  timezone: 'Asia/Kolkata',
  email: 'kun.shiroko02@gmail.com',
  workEmail: 'swastikgupta.nexboy@gmail.com',
  resume: 'https://drive.google.com/file/d/12ejKvGYMxyKEVWEPuuWtopX1kdOLehZH/view?usp=drive_link',
  portrait: '/work/portrait.webp',
  social: [
    { label: 'Instagram', href: 'https://instagram.com/sxk.m4in' },
    { label: 'YouTube', href: 'https://youtube.com/@Shirokokun' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/swastik-gupta-263273365' },
    { label: 'GitHub', href: 'https://github.com/ShirokoKun' },
    { label: 'Substack', href: 'https://shirokokun.substack.com' },
    { label: 'Spotify', href: 'https://open.spotify.com/user/n4nu6jhafrbvw7r3b5hlfk90a' },
  ],
};

/** Copy that changes with the Professional / Personal switch. Kept short on purpose. */
export const modeCopy = {
  professional: {
    label: 'Professional',
    short: 'Pro',
    status: 'Motion designer at IDK Show',
    heroLines: ['Motion designer,', 'creative generalist.'],
    heroIntro:
      'I design motion for IDK Show, a YouTube show about AI and the future. Before that: event films, identities and campaigns for 20+ clients.',
    aboutTitle: 'I make complicated ideas easy to watch.',
    about:
      "I'm Swastik, based in Bhubaneswar. A computer science degree from IIIT Bhubaneswar means I'm as at home in an expression panel as in a Figma file. I like rhythm, clarity and a little chaos.",
    signoffTitle: 'Got something that needs to move?',
    signoffIntro: 'Open to motion design roles, freelance edits and collaborations.',
  },
  personal: {
    label: 'Personal',
    short: 'After hours',
    status: 'Editing something at 3am',
    heroIntro: 'Edits, posters and 3am experiments. No briefs, no clients, just taste.',
    signoffTitle: ['Say hi,', 'send songs.'],
    signoffIntro: 'Collabs with artists, music video ideas or a good track. My inbox is open.',
  },
} as const;

export type Media =
  { type: 'youtube'; id: string; vertical?: boolean } | { type: 'image'; src: string } | { type: 'link'; href: string };

/** Tracks on the professional timeline, top to bottom, like an edit timeline. */
export type Track = 'motion' | 'design' | 'roles';
export const tracks: { id: Track; code: string; label: string }[] = [
  { id: 'motion', code: 'V2', label: 'Motion & edit' },
  { id: 'design', code: 'V1', label: 'Design' },
  { id: 'roles', code: 'A1', label: 'Roles' },
];

/** First and last year on the timeline ruler. "Now" counts as this year. */
export const TIMELINE_START = 2019;
export const TIMELINE_END = 2026;

export type Project = {
  id: string;
  /** Professional work: which timeline track it sits on, and the years it covers. */
  track?: Track;
  span?: [number, number];
  title: string;
  context: string;
  disciplines: string[];
  year: string;
  modes: Mode[];
  /** Image shown on hover / cards. Falls back to a typographic tile. */
  cover?: string;
  media: Media;
  description: string;
  link?: { label: string; href: string };
  stat?: string;
  featured?: boolean;
  placeholder?: boolean;
};

const yt = (id: string, quality: 'maxresdefault' | 'sddefault' | 'hqdefault' = 'maxresdefault') =>
  `https://i.ytimg.com/vi/${id}/${quality}.jpg`;

export const projects: Project[] = [
  // ─── Professional ────────────────────────────────────────────────────────────
  {
    id: 'idk-show',
    track: 'motion',
    span: [2026, 2026],
    title: 'IDK Show',
    context: 'Motion Designer, ongoing',
    disciplines: ['Motion Design', 'Explainer Graphics'],
    year: 'Now',
    modes: ['professional'],
    media: { type: 'link', href: 'https://www.youtube.com/@IDK_Show' },
    description:
      'IDK Show is a YouTube show about the future: AI, technology and what it means to be human in an age of machines. I design the motion graphics that make those ideas easy to follow.',
    link: { label: 'Watch IDK Show on YouTube', href: 'https://www.youtube.com/@IDK_Show' },
    featured: true,
    placeholder: true,
  },
  {
    id: 'advaita-aftermovie',
    track: 'motion',
    span: [2023, 2023],
    title: 'Advaita 2023',
    context: 'IIIT Bhubaneswar, annual fest',
    disciplines: ['Event Film', 'Edit', 'Colour'],
    year: '2023',
    modes: ['professional'],
    cover: yt('tfCacIMaZCA'),
    media: { type: 'youtube', id: 'tfCacIMaZCA' },
    description:
      'The perspective aftermovie for Advaita 2023, IIIT Bhubaneswar’s flagship techno-cultural fest. Shot, cut and graded to carry three days of the festival in just over a minute.',
    featured: true,
  },
  {
    id: 'advaita-identity',
    track: 'design',
    span: [2023, 2023],
    title: 'Advaita: Stellar Reverie',
    context: 'Fest identity poster',
    disciplines: ['Graphic Design', 'Identity'],
    year: '2023',
    modes: ['professional'],
    cover: '/work/posters/advaita-idea-design.webp',
    media: { type: 'image', src: '/work/posters/advaita-idea-design.webp' },
    description:
      'Theme poster exploration for Advaita, IIIT Bhubaneswar’s fest, where I contributed to the creative team for three years running.',
  },
  {
    id: 'video-editing',
    track: 'motion',
    span: [2019, 2026],
    title: 'Video Editing',
    context: 'Client collection',
    disciplines: ['Edit', 'Motion', 'Sound'],
    year: '2019–26',
    modes: ['professional'],
    media: {
      type: 'link',
      href: 'https://drive.google.com/drive/folders/1P_GtEDtQguLLV4JNT0ZlxZmKFbbRQ9dJ?usp=drive_link',
    },
    description: 'A folder of client edits: reels, promos, event films and talking-head cuts with motion graphics.',
    link: {
      label: 'Open the collection',
      href: 'https://drive.google.com/drive/folders/1P_GtEDtQguLLV4JNT0ZlxZmKFbbRQ9dJ?usp=drive_link',
    },
  },
  {
    id: 'cover-art',
    track: 'design',
    span: [2023, 2025],
    title: 'Cover Art',
    context: 'Releases for independent artists',
    disciplines: ['Graphic Design', 'Music'],
    year: '2023–25',
    modes: ['professional'],
    media: {
      type: 'link',
      href: 'https://drive.google.com/drive/folders/1FKODRxHko0DphnE54FyXnWrpu41LQ3_q?usp=drive_link',
    },
    description:
      'Single and EP artwork for independent musicians, built to read at thumbnail size and hold up full screen.',
    link: {
      label: 'Open the collection',
      href: 'https://drive.google.com/drive/folders/1FKODRxHko0DphnE54FyXnWrpu41LQ3_q?usp=drive_link',
    },
  },
  {
    id: 'posters',
    track: 'design',
    span: [2022, 2025],
    title: 'Posters',
    context: 'Events, promotions and campaigns',
    disciplines: ['Graphic Design', 'Print'],
    year: '2022–25',
    modes: ['professional'],
    media: {
      type: 'link',
      href: 'https://drive.google.com/drive/folders/1jA62SJHk5ib65efYQpocjZoEs3M8yDmH?usp=drive_link',
    },
    description: 'Poster design for events, launches and marketing campaigns.',
    link: {
      label: 'Open the collection',
      href: 'https://drive.google.com/drive/folders/1jA62SJHk5ib65efYQpocjZoEs3M8yDmH?usp=drive_link',
    },
  },
  {
    id: 'social',
    track: 'design',
    span: [2023, 2025],
    title: 'Social Campaigns',
    context: 'Content for brands and startups',
    disciplines: ['Social', 'Marketing Ops'],
    year: '2023–25',
    modes: ['professional'],
    media: {
      type: 'link',
      href: 'https://drive.google.com/drive/folders/1uIdi4muIWECjgenovevfxn4Ft6MCrNwa?usp=drive_link',
    },
    description: 'Social media posts and campaign assets designed for reach and consistency.',
    link: {
      label: 'Open the collection',
      href: 'https://drive.google.com/drive/folders/1uIdi4muIWECjgenovevfxn4Ft6MCrNwa?usp=drive_link',
    },
  },
  {
    id: 'contributions',
    track: 'motion',
    span: [2022, 2025],
    title: 'Projects & Contributions',
    context: 'Collaborations and initiatives',
    disciplines: ['Mixed'],
    year: '2022–25',
    modes: ['professional'],
    media: {
      type: 'link',
      href: 'https://drive.google.com/drive/folders/18Jy_OZJjLcHUycapitb6PLfeyHpgg6K2?usp=drive_link',
    },
    description: 'Contributions to collaborative projects, societies and festivals.',
    link: {
      label: 'Open the collection',
      href: 'https://drive.google.com/drive/folders/18Jy_OZJjLcHUycapitb6PLfeyHpgg6K2?usp=drive_link',
    },
  },

  // ─── Personal ────────────────────────────────────────────────────────────────
  {
    id: 'roshni',
    title: 'Roshni',
    context: 'Awwn1k & Yungsta, visual edit',
    disciplines: ['Music Visual', 'Motion'],
    year: '2026',
    modes: ['personal'],
    cover: yt('bwCilIeiXgI'),
    media: { type: 'youtube', id: 'bwCilIeiXgI' },
    description: 'Two takes on a visual edit for Roshni by Awwn1k & Yungsta. Ver.02 is the one I kept going back to.',
    featured: true,
  },
  {
    id: 'bargad',
    title: 'Bargad',
    context: 'sufr x arpit bala, Visual Archive 01',
    disciplines: ['Music Visual', 'Archive'],
    year: '2026',
    modes: ['personal'],
    cover: yt('IzoESeCBPEI'),
    media: { type: 'youtube', id: 'IzoESeCBPEI' },
    description: 'First entry in a visual archive series: an edit built around Bargad by sufr and arpit bala.',
    featured: true,
  },
  {
    id: 'iss-tarah',
    title: 'Iss Tarah',
    context: 'Chaar Diwaari & Sonu Nigam',
    disciplines: ['Music Visual'],
    year: '2026',
    modes: ['personal'],
    cover: yt('2hLeUNUrOq8'),
    media: { type: 'youtube', id: '2hLeUNUrOq8', vertical: true },
    description: 'A vertical visual for Iss Tarah.',
  },
  {
    id: 'chole-ay',
    title: 'Chole Ay',
    context: 'w/ barneysku & Awwn1k, 1K subscriber special',
    disciplines: ['Music Visual', 'Bengali Hip-hop'],
    year: '2025',
    modes: ['personal'],
    cover: yt('fdktP0hqxIM'),
    media: { type: 'youtube', id: 'fdktP0hqxIM', vertical: true },
    description: 'Made with barneysku and Awwn1k to celebrate the channel hitting 1,000 subscribers.',
  },
  {
    id: 'ye-jaane-na',
    title: 'Ye Jaane Na',
    context: 'vichaarmusic',
    disciplines: ['Music Visual'],
    year: '2025',
    modes: ['personal'],
    cover: yt('mkValM-ML5U'),
    media: { type: 'youtube', id: 'mkValM-ML5U', vertical: true },
    description: 'An edit for Ye Jaane Na by vichaarmusic.',
  },
  {
    id: 'lena-mera-naam',
    title: 'Lena Mera Naam',
    context: 'amr8music, Shy.wry, srijjan',
    disciplines: ['Music Visual'],
    year: '2025',
    modes: ['personal'],
    cover: yt('NIZUKj-nSwg'),
    media: { type: 'youtube', id: 'NIZUKj-nSwg', vertical: true },
    description: 'A visual edit for Lena Mera Naam.',
  },
  {
    id: 'mograph-overlay',
    title: 'Mograph Overlay',
    context: 'Alight Motion experiment',
    disciplines: ['Motion Graphics'],
    year: '2025',
    modes: ['personal'],
    cover: yt('RRysLcgdICE'),
    media: { type: 'youtube', id: 'RRysLcgdICE', vertical: true },
    description: 'A twelve-second motion graphic overlay study, built entirely on a phone.',
  },
  {
    id: 'visual-mixtape',
    title: 'Visual Mixtape 01',
    context: 'Vlog fragments',
    disciplines: ['Edit', 'Experimental'],
    year: '2025',
    modes: ['personal'],
    cover: yt('74xiqdKBDAc'),
    media: { type: 'youtube', id: '74xiqdKBDAc', vertical: true },
    description: 'Short fragments cut like a mixtape. Part of an ongoing visual mixtape series.',
  },
  {
    id: 'surrealism-01',
    title: "You're Just Some Data",
    context: 'Surrealism 01',
    disciplines: ['Motion', 'Surrealism'],
    year: '2025',
    modes: ['personal'],
    cover: yt('5T9cB8_QUjc'),
    media: { type: 'youtube', id: '5T9cB8_QUjc', vertical: true },
    description: 'Logging in… An eleven-second surrealist piece about being reduced to data.',
  },
  {
    id: 'space-song',
    title: 'Space Song',
    context: 'Beach House, anime edit',
    disciplines: ['Anime Edit'],
    year: '2022',
    modes: ['personal'],
    cover: yt('f5Wfqm7FQXY'),
    media: { type: 'youtube', id: 'f5Wfqm7FQXY', vertical: true },
    description: 'The one that blew up. A quiet, sad anime edit to Space Song that found a huge audience.',
    stat: '865K views',
    featured: true,
  },
  {
    id: 'terror-in-resonance',
    title: 'Terror in Resonance',
    context: 'Jay Sean, Down',
    disciplines: ['Anime Edit'],
    year: '2022',
    modes: ['personal'],
    cover: yt('UcQnibdgxDw'),
    media: { type: 'youtube', id: 'UcQnibdgxDw', vertical: true },
    description: 'An aesthetic AMV cut to Down by Jay Sean.',
    stat: '113K views',
  },
  {
    id: 'body-glow',
    title: 'Body Glow Tutorial',
    context: 'CapCut effect breakdown',
    disciplines: ['Tutorial'],
    year: '2024',
    modes: ['personal'],
    cover: yt('eHMC7cUAGTI'),
    media: { type: 'youtube', id: 'eHMC7cUAGTI', vertical: true },
    description: 'A one-minute breakdown of the trending body glow effect.',
    stat: '33K views',
  },
  {
    id: 'travel',
    title: 'What I See When I Travel',
    context: 'Mixed media',
    disciplines: ['Mixed Media'],
    year: '2024',
    modes: ['personal'],
    cover: yt('HlB77ZFaKCg'),
    media: { type: 'youtube', id: 'HlB77ZFaKCg', vertical: true },
    description: 'Ten seconds of travel, collaged.',
  },
];

/** The reel each side plays, and the frames its film strip shows. */
export const showreel: Record<
  Mode,
  { title: string; caption: string; youtubeId: string; frames: string[]; placeholder?: boolean }
> = {
  professional: {
    title: 'Reel 2026',
    caption: 'The 2026 motion reel is in the edit. Until then, this plays the Advaita ’23 aftermovie.',
    youtubeId: 'tfCacIMaZCA',
    placeholder: true,
    frames: [
      yt('tfCacIMaZCA'),
      '/work/posters/advaita-idea-design.webp',
      yt('IzoESeCBPEI'),
      '/work/posters/barneyysku.webp',
      yt('bwCilIeiXgI'),
      '/work/posters/jaiyash-fadedxfalak.webp',
      yt('f5Wfqm7FQXY'),
      '/work/posters/urban-decay.webp',
      yt('fdktP0hqxIM'),
      '/work/posters/gojo-poster.webp',
    ],
  },
  personal: {
    title: 'Roshni Ver.02',
    caption: 'Latest drop: a visual edit for Roshni by Awwn1k & Yungsta.',
    youtubeId: 'bwCilIeiXgI',
    frames: [yt('bwCilIeiXgI'), yt('fdktP0hqxIM'), yt('f5Wfqm7FQXY'), yt('5T9cB8_QUjc')],
  },
};

export type TimelineItem = {
  year: string;
  title: string;
  org: string;
  note: string;
  current?: boolean;
  /** Years on the timeline ruler (experience only). */
  span?: [number, number];
};

export const experience: TimelineItem[] = [
  {
    year: 'Now',
    title: 'Motion Designer',
    org: 'IDK Show',
    span: [2026, 2026],
    note: 'Motion graphics for a YouTube show about AI and the future.',
    current: true,
  },
  {
    year: '2025',
    title: 'Marketing Ops Intern',
    org: 'Tidyhire',
    span: [2025, 2025],
    note: 'A hybrid of marketing operations and visual design.',
  },
  {
    year: '2025',
    title: 'Creative Associate',
    org: 'Astrix',
    span: [2025, 2025],
    note: 'Integrated campaigns pulling every discipline together.',
  },
  {
    year: '2024',
    title: 'Creative Lead',
    org: 'Fastrbuild',
    span: [2024, 2024],
    note: 'First leadership role, owning creative strategy for the brand.',
  },
  {
    year: '2023',
    title: 'Freelance',
    org: 'Independent practice',
    span: [2023, 2023],
    note: '20+ clients and 5+ brands across edit, motion and design.',
  },
  {
    year: '2023',
    title: 'Media Coordinator',
    org: 'D3 Fest',
    span: [2023, 2023],
    note: "Ran media for Odisha's largest techno-cultural fest.",
  },
  {
    year: '2023',
    title: 'Creative Contributor',
    org: 'Advaita, IIIT Bhubaneswar',
    span: [2023, 2023],
    note: 'Three years on the flagship fest, aftermovie included.',
  },
  {
    year: '2022',
    title: 'Core Team',
    org: 'Photography & Tech Society',
    span: [2022, 2022],
    note: 'From member to core team, shooting and editing for campus.',
  },
];

export const journey: TimelineItem[] = [
  {
    year: '2026',
    title: 'Visual Archive',
    org: 'Music visuals series',
    note: 'Bargad, Roshni and more. Cutting visuals for artists I love.',
    current: true,
  },
  {
    year: '2025',
    title: '1K on YouTube',
    org: '@Shirokokun',
    note: 'Celebrated with a Chole Ay edit alongside barneysku & Awwn1k.',
  },
  { year: '2025', title: 'Visual Mixtapes', org: 'Experiments', note: 'Short, loud, phone-first motion sketches.' },
  {
    year: '2024',
    title: 'Poster Era',
    org: 'Grunge & type',
    note: 'Yeezus, Urban Decay, Stay Creative. A poster a week.',
  },
  { year: '2022', title: 'IIIT Bhubaneswar', org: 'B.Tech CS', note: 'Balancing compilers with keyframes.' },
  {
    year: '2022',
    title: '865K Views',
    org: 'Space Song edit',
    note: 'A sad anime edit that travelled further than I ever expected.',
  },
  {
    year: '2021',
    title: 'First Edit',
    org: 'Sasuke x Cradles',
    note: 'Posted my first CapCut edit. Never looked back.',
  },
  { year: '2019', title: 'Creative Awakening', org: 'The start', note: 'Picked up video editing and visual design.' },
];

export const stats: Record<Mode, { value: number; suffix: string; label: string }[]> = {
  professional: [
    { value: 100, suffix: '+', label: 'Projects delivered' },
    { value: 20, suffix: '+', label: 'Clients' },
    { value: 5, suffix: '+', label: 'Brands' },
    { value: 5, suffix: '+', label: 'Years editing' },
  ],
  personal: [
    { value: 865, suffix: 'K', label: 'Views on one edit' },
    { value: 18, suffix: '', label: 'Posters on this site' },
    { value: 2019, suffix: '', label: 'Making stuff since' },
    { value: 3, suffix: 'am', label: 'Peak productivity' },
  ],
};

export const capabilities = [
  {
    title: 'Motion Design',
    detail: 'Explainers, kinetic type, overlays and title sequences.',
    tools: ['After Effects', 'Alight Motion', 'Blender'],
  },
  {
    title: 'Video Editing',
    detail: 'Event films, music visuals, reels and long-form YouTube.',
    tools: ['Premiere Pro', 'DaVinci Resolve', 'CapCut'],
  },
  {
    title: 'Graphic Design',
    detail: 'Posters, cover art, identities and social systems.',
    tools: ['Photoshop', 'Illustrator', 'Figma'],
  },
  {
    title: 'UI / UX & Web',
    detail: 'Interfaces and sites, from wireframe to shipped code.',
    tools: ['Figma', 'React', 'Next.js', 'TypeScript'],
  },
  {
    title: 'Creative Coding',
    detail: 'Generative and real-time visuals.',
    tools: ['TouchDesigner', 'p5.js', 'Python'],
  },
  {
    title: 'Marketing Ops & AI',
    detail: 'Campaigns, content strategy and automation.',
    tools: ['ElevenLabs', 'Cursor', 'Automation'],
  },
];

export type Poster = { src: string; title: string; year?: string; w: number; h: number };

export const posters: Poster[] = [
  { src: '/work/posters/yeposter.webp', title: 'Yeezus', year: '2024', w: 1350, h: 1800 },
  { src: '/work/posters/untitled-rdrg1.webp', title: 'Stay Creative', year: '2025', w: 1400, h: 1750 },
  { src: '/work/posters/c-est-la-vie.webp', title: "O'Death / C'est la vie", w: 1400, h: 1750 },
  { src: '/work/posters/fxxxx-club-grunge.webp', title: 'FXXXX Club', w: 1350, h: 1800 },
  { src: '/work/posters/urban-decay.webp', title: 'Urban Decay', w: 1350, h: 1800 },
  { src: '/work/posters/barneyysku.webp', title: 'Excuse Me Miss', year: '2025', w: 1400, h: 1751 },
  { src: '/work/posters/gojo-poster.webp', title: 'Gojo Satoru', w: 1350, h: 1800 },
  { src: '/work/posters/new-project-49-6070df3.webp', title: 'I Am Music', w: 1080, h: 1350 },
  { src: '/work/posters/utopia-poster-ideation.webp', title: 'Utopia', w: 1350, h: 1800 },
  { src: '/work/posters/crosshair.webp', title: 'Crosshair+', w: 1400, h: 1750 },
  { src: '/work/posters/am-i-even-alive.webp', title: 'Am I Even Alive?', w: 1400, h: 1750 },
  { src: '/work/posters/harmony.webp', title: 'Harmony', w: 1350, h: 1800 },
  { src: '/work/posters/urban-decay-y.webp', title: 'Urban Decay (Blue)', w: 1350, h: 1800 },
  { src: '/work/posters/pink-floyd.webp', title: 'Floyd', w: 1400, h: 1400 },
  { src: '/work/posters/w.webp', title: 'Hands', w: 1400, h: 1400 },
  { src: '/work/posters/jaiyash-fadedxfalak.webp', title: 'Faded x Falak', w: 1080, h: 1080 },
  { src: '/work/posters/shiroko.webp', title: 'Shiroko', w: 1080, h: 1080 },
  { src: '/work/posters/advaita-idea-design.webp', title: 'Stellar Reverie', w: 1400, h: 1634 },
];

export const notes = [
  {
    date: 'Oct 2026',
    tag: 'Build',
    title: 'Portfolio v3',
    text: 'Rebuilt the whole site around one switch: who you get, the pro or the kid with CapCut.',
  },
  {
    date: 'Sep 2026',
    tag: 'Edit',
    title: 'Visual Archive',
    text: 'Starting a series of music visuals. Bargad first, Roshni next.',
  },
  {
    date: 'Ongoing',
    tag: 'Learning',
    title: 'Expressions',
    text: 'Trying to replace every keyframe I can with an expression. Not always wise.',
  },
  {
    date: 'Ongoing',
    tag: 'Listening',
    title: 'Bengali hip-hop',
    text: 'Awwn1k and barneysku on repeat. Expect more edits.',
  },
];

export const nav: Record<Mode, { label: string; href: string }[]> = {
  professional: [
    { label: 'Work', href: '/#timeline' },
    { label: 'About', href: '/#about' },
    { label: 'Archive', href: '/work' },
    { label: 'Writing', href: '/blog' },
    { label: 'Contact', href: '/#contact' },
  ],
  personal: [
    { label: 'Board', href: '/#board' },
    { label: 'Receipt', href: '/#receipt' },
    { label: 'Writing', href: '/blog' },
    { label: 'Say hi', href: '/#contact' },
  ],
};

export const projectsFor = (mode: Mode) => projects.filter((p) => p.modes.includes(mode));
