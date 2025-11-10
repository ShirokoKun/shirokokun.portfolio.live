# 🎨 Portfolio - ShirokoKun

[![Next.js](https://img.shields.io/badge/Next.js-13.5.11-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-green?style=flat-square&logo=express)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

> A modern, glassmorphic portfolio website with integrated blog, timeline, and real-time Spotify/YouTube widgets.

---

## 🌟 Features

### ✨ **Frontend (Next.js)**
- **Homepage**: Hero section, About, Bio, Metrics, Projects showcase, Skills grid, Artwork gallery, Blog teaser
- **MySpace**: Personal corner with Ideas/Notes bento grid, Instagram Reels, Interactive Timeline, Spotify Now Playing, YouTube videos
- **Blog**: Substack RSS integration with glassmorphic cards
- **Contact**: Form submission via Google Sheets backend
- **Projects**: Portfolio showcase with category filters
- **Animations**: Framer Motion with scroll-based triggers
- **Design**: Custom glassmorphism with chromatic aberration, minimalistic black & white theme

### 🔧 **Backend (Express + TypeScript)**
- **Blog API**: Fetches and caches Substack RSS feed
- **Contact API**: Submits form data to Google Sheets
- **CORS**: Configured for frontend integration
- **Rate Limiting**: Prevents API abuse
- **Error Handling**: Centralized error middleware
- **Caching**: In-memory cache for blog posts (30 min TTL)

### 🎵 **Integrations**
- **YouTube API**: Displays latest channel videos with statistics
- **Spotify API**: Now playing widget (OAuth setup ready)
- **Google Sheets**: Contact form backend
- **Substack**: Blog post aggregation

---

## 📁 Project Structure

```
portfolio/
├── portfolio-website/       # Frontend (Next.js)
│   ├── app/                # Next.js App Router
│   │   ├── page.tsx       # Homepage
│   │   ├── myspace/       # MySpace page
│   │   ├── blog/          # Blog page
│   │   ├── contact/       # Contact page
│   │   ├── projects/      # Projects page
│   │   └── api/           # API routes
│   ├── components/        # React components
│   ├── public/            # Static assets
│   └── .env.example       # Environment template
│
├── portfolio-backend/      # Backend (Express)
│   ├── src/
│   │   ├── index.ts       # Server entry
│   │   ├── controllers/   # Route controllers
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── middlewares/   # Express middlewares
│   └── .env.example       # Environment template
│
├── ARCHITECTURE.md        # Detailed architecture docs
├── DEPLOYMENT_CHECKLIST.md # Step-by-step deployment guide
└── README.md             # This file
```

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js ≥ 18.0.0
- npm or yarn
- Git

### **Local Development**

1. **Clone the repository**
```bash
git clone https://github.com/ShirokoKun/shirokokun.portfolio.live.git
cd portfolio
```

2. **Setup Frontend**
```bash
cd portfolio-website
npm install
cp .env.example .env.local
# Add your API credentials to .env.local
npm run dev
# Frontend runs on http://localhost:3000
```

3. **Setup Backend**
```bash
cd ../portfolio-backend
npm install
cp .env.example .env
# Add your credentials to .env
npm run dev
# Backend runs on http://localhost:8080
```

4. **Open in browser**
```
Frontend: http://localhost:3000
Backend API: http://localhost:8080/api
```

---

## 🔐 Environment Variables

### **Frontend (.env.local)**
```env
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=your_channel_id
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### **Backend (.env)**
```env
PORT=8080
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
SUBSTACK_RSS_URL=https://shirokokun.substack.com/feed
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=your_private_key
GOOGLE_SHEETS_ID=your_sheet_id
GOOGLE_SHEETS_RANGE=Responses!A:E
CACHE_TTL=1800
```

**📝 Note**: See `.env.example` files in each directory for complete templates.

---

## 📦 Deployment

### **Frontend (Vercel)**

1. Push `frontend-deploy` branch
```bash
git checkout -b frontend-deploy
git push origin frontend-deploy
```

2. Deploy on Vercel:
   - Connect GitHub repo
   - Framework: Next.js
   - Root Directory: `portfolio-website`
   - Add environment variables from `.env.example`

### **Backend (Render/Railway)**

1. Push `backend-deploy` branch
```bash
git checkout -b backend-deploy
git push origin backend-deploy
```

2. Deploy on Render:
   - Connect GitHub repo
   - Root Directory: `portfolio-backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add environment variables from `.env.example`

**📖 Detailed Instructions**: See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 13.5.11 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React

### **Backend**
- **Framework**: Express.js
- **Language**: TypeScript
- **Validation**: Zod
- **HTTP Client**: Node Fetch
- **Caching**: Node Cache
- **Security**: Helmet, CORS, Rate Limiting
- **RSS Parsing**: rss-parser

### **APIs & Services**
- YouTube Data API v3
- Spotify Web API
- Google Sheets API
- Substack RSS

---

## 📱 Pages

### 🏠 **Homepage** (`/`)
- Hero with animated text and glassmorphic card
- About section with profile image
- Bio with personal story
- Metrics (followers, projects, years)
- Projects showcase with hover effects
- Skills grid (Technical, Creative, Collaboration)
- Artwork gallery
- Blog teaser with latest posts
- Footer with social links

### 🎭 **MySpace** (`/myspace`)
- **Bento Grid**: Ideas & Notes (2/3) + Instagram Reels (1/3)
- **Journey Timeline**: Horizontal scrolling timeline with 10 milestones (2014-2025)
- **Spotify Widget**: Now playing with album art
- **YouTube Slider**: Latest videos with auto-play carousel

### 📝 **Blog** (`/blog`)
- Substack integration
- Card-based layout with glassmorphism
- Read time estimates
- Category tags
- Opens posts in new tab

### 📧 **Contact** (`/contact`)
- Form with validation
- Submits to Google Sheets via backend API
- Success/error notifications

### 🎨 **Projects** (`/projects`)
- Portfolio showcase
- Category filters
- Project cards with hover effects
- External links to live demos/repos

---

## 🎨 Design System

### **Colors**
- **Background**: Pure black (`#000000`)
- **Text**: White with subtle shadows
- **Accents**: Minimal, context-specific (green for Spotify, red for YouTube)
- **Borders**: White with low opacity (`white/5`, `white/10`)

### **Glassmorphism**
- Custom `GlassSurface` component
- Chromatic aberration effect (RGB channel offset)
- Backdrop blur with low opacity backgrounds
- Distortion scale for depth

### **Typography**
- **Headings**: Sora (bold, black weights)
- **Body**: System fonts with Sora fallback
- **Shadows**: Subtle white glows for depth

### **Animations**
- Framer Motion scroll-based triggers
- Hover effects (translate, scale)
- Page transitions
- Stagger animations for lists

---

## 📊 API Endpoints

### **Frontend API Routes** (`/api`)
- `GET /api/youtube/videos` - Fetch YouTube channel videos
- `GET /api/spotify/auth` - Spotify OAuth URL
- `GET /api/spotify/callback` - OAuth callback handler
- `GET /api/spotify/now-playing` - Current track (requires auth)
- `GET /api/spotify/recently-played` - Recent tracks (requires auth)
- `POST /api/contact` - Submit contact form
- `GET /api/substack` - Fetch blog posts

### **Backend API** (Express)
- `GET /api/blog` - Substack RSS feed (cached)
- `POST /api/contact` - Google Sheets submission

---

## 🧪 Development Scripts

### **Frontend**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # TypeScript type checking
```

### **Backend**
```bash
npm run dev          # Start with hot reload (tsx)
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

---

## 🤝 Contributing

This is a personal portfolio project. However, if you find bugs or have suggestions:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Author

**ShirokoKun**
- Creative Technologist
- 100+ Projects • Final Year CS
- [GitHub](https://github.com/ShirokoKun)
- [Substack](https://shirokokun.substack.com)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Vercel](https://vercel.com/) - Deployment platform
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact via the portfolio contact form
- Email: [Your Email]

---

## 🗺️ Roadmap

- [ ] Complete Spotify OAuth integration
- [ ] Add Instagram Reels (manual via Google Sheets)
- [ ] Implement blog search functionality
- [ ] Add project filtering by technology
- [ ] Dark/Light mode toggle (currently dark only)
- [ ] Blog comments section
- [ ] Analytics dashboard
- [ ] Newsletter signup integration

---

**Last Updated**: November 10, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

---

<p align="center">Made with ❤️ and ☕ by ShirokoKun</p>
