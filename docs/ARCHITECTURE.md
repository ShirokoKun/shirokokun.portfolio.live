# Portfolio Architecture Documentation

## 📋 Current Working Architecture

### **Project Structure**
```
portfolio/
├── portfolio-website/          # Frontend (Next.js 13.5.11)
│   ├── app/                   # Next.js App Router
│   │   ├── page.tsx          # Homepage
│   │   ├── myspace/          # MySpace page
│   │   ├── blog/             # Blog page
│   │   ├── contact/          # Contact page
│   │   ├── projects/         # Projects page
│   │   └── api/              # API Routes (YouTube, Spotify, Contact, Substack)
│   ├── components/           # React Components
│   │   ├── timeline/         # Journey Timeline components
│   │   ├── youtube/          # YouTube integration
│   │   ├── spotify/          # Spotify integration
│   │   └── ui/               # Shadcn UI components
│   ├── public/               # Static assets
│   ├── .env.local            # Frontend environment variables (NOT IN GIT)
│   └── package.json
│
├── portfolio-backend/         # Backend (Express + TypeScript)
│   ├── src/
│   │   ├── index.ts          # Main server file
│   │   ├── controllers/      # Blog & Contact controllers
│   │   ├── routes/           # API routes
│   │   ├── services/         # Google Sheets & Substack services
│   │   └── middlewares/      # CORS, Rate limit, Error handling
│   ├── .env                  # Backend environment variables (NOT IN GIT)
│   ├── .env.example          # Template for environment variables
│   └── package.json
│
├── .gitignore                # Root gitignore
└── package.json              # Root package.json (shared dependencies)
```

---

## 🏗️ Architecture Components

### **Frontend (Next.js)**
- **Framework**: Next.js 13.5.11 with App Router
- **Styling**: Tailwind CSS + Custom Glassmorphism
- **Animations**: Framer Motion
- **UI Library**: Shadcn UI (Radix UI primitives)
- **Deployment**: Vercel
- **Domain**: TBD

#### Key Features:
1. **Homepage**: Hero, About, Bio, Metrics, Projects, Skills, Artwork, Blog Teaser
2. **MySpace**: Personal corner with Ideas/Notes, Instagram Reels, Timeline, Spotify, YouTube
3. **Blog**: Substack integration via API
4. **Contact**: Form submission via Google Sheets
5. **Projects**: Portfolio showcase with filters

#### API Routes (Next.js):
- `/api/youtube/videos` - Fetch YouTube channel videos
- `/api/spotify/auth` - Spotify OAuth setup
- `/api/spotify/callback` - Spotify OAuth callback
- `/api/spotify/now-playing` - Current track (pending auth)
- `/api/spotify/recently-played` - Recent tracks (pending auth)
- `/api/contact` - Contact form submission
- `/api/substack` - Substack blog posts

### **Backend (Express)**
- **Framework**: Express.js with TypeScript
- **Deployment**: Render/Railway/Heroku
- **Port**: 8080

#### Endpoints:
- `GET /api/blog` - Fetch Substack blog posts
- `POST /api/contact` - Submit contact form to Google Sheets

---

## 🔐 Environment Variables

### **Frontend (.env.local)**
```env
# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_CHANNEL_ID=UCobGcfjAgSJqgZaHFAuzkKg

# Spotify API
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
SPOTIFY_REFRESH_TOKEN=<TO_BE_OBTAINED>

# Backend API URL
NEXT_PUBLIC_BACKEND_URL=https://your-backend.render.com
```

### **Backend (.env)**
```env
# Server
PORT=8080
NODE_ENV=production

# CORS
ALLOWED_ORIGINS=https://your-frontend.vercel.app

# Substack
SUBSTACK_RSS_URL=https://shirokokun.substack.com/feed

# Google Sheets (Contact Form)
GOOGLE_SERVICE_ACCOUNT_EMAIL=<YOUR_SERVICE_ACCOUNT>
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=<YOUR_PRIVATE_KEY>
GOOGLE_SHEETS_ID=<YOUR_SHEET_ID>
GOOGLE_SHEETS_RANGE=Responses!A:E

# Cache
CACHE_TTL=1800
```

---

## 🚀 Deployment Strategy

### **Branch Structure**
```
main (master)                  # Production-ready code
├── frontend-deploy            # Frontend deployment branch
└── backend-deploy             # Backend deployment branch
```

### **Deployment Steps**

#### 1. **Frontend Deployment (Vercel)**
```bash
# Create frontend branch
git checkout -b frontend-deploy

# Copy only frontend files
git add portfolio-website/
git commit -m "Deploy: Frontend to Vercel"
git push origin frontend-deploy

# Deploy on Vercel:
# - Connect GitHub repo
# - Root Directory: portfolio-website
# - Framework Preset: Next.js
# - Add environment variables from .env.local
```

#### 2. **Backend Deployment (Render/Railway)**
```bash
# Create backend branch
git checkout -b backend-deploy

# Copy only backend files
git add portfolio-backend/
git commit -m "Deploy: Backend to Render"
git push origin backend-deploy

# Deploy on Render:
# - Connect GitHub repo
# - Root Directory: portfolio-backend
# - Build Command: npm install && npm run build
# - Start Command: npm start
# - Add environment variables from .env
```

---

## 📦 Files to Include in Git

### ✅ **Include**
- All source code (`/src`, `/app`, `/components`)
- Configuration files (`package.json`, `tsconfig.json`, `next.config.js`)
- Public assets (`/public`)
- Documentation (`README.md`, `ARCHITECTURE.md`)
- `.env.example` files (templates)
- `.gitignore`

### ❌ **Exclude (in .gitignore)**
- `node_modules/`
- `.env`, `.env.local`, `.env*.local`
- `.next/`, `dist/`, `build/`, `out/`
- `*.log`
- `.DS_Store`, `Thumbs.db`
- `.vscode/`, `.idea/`
- Development scripts (`start-*.bat`, `start-*.ps1`)
- Test files
- Documentation files (if too many)

---

## 🔧 Setup Instructions

### **Local Development**

#### Frontend:
```bash
cd portfolio-website
npm install
cp .env.example .env.local  # Add your credentials
npm run dev  # Runs on http://localhost:3000
```

#### Backend:
```bash
cd portfolio-backend
npm install
cp .env.example .env  # Add your credentials
npm run dev  # Runs on http://localhost:8080
```

### **Production Deployment**

#### Prerequisites:
1. ✅ YouTube API credentials
2. ✅ Spotify API credentials (+ refresh token)
3. ✅ Google Sheets API credentials
4. ✅ Vercel account
5. ✅ Render/Railway account

#### Deploy Frontend:
1. Push `frontend-deploy` branch
2. Connect to Vercel
3. Set environment variables
4. Deploy

#### Deploy Backend:
1. Push `backend-deploy` branch
2. Connect to Render
3. Set environment variables
4. Deploy

#### Update URLs:
- Frontend: Update `NEXT_PUBLIC_BACKEND_URL` in Vercel
- Backend: Update `ALLOWED_ORIGINS` in Render

---

## 🎯 Current Status

### ✅ **Completed**
- Frontend UI (Homepage, MySpace, Blog, Contact, Projects)
- YouTube API integration (functional)
- Spotify API setup (auth flow ready, awaiting user OAuth)
- Timeline with 10 comprehensive milestones
- Bento grid layout in MySpace
- Compact Spotify + YouTube sections
- Backend API structure (Express + TypeScript)
- Google Sheets integration for contact form
- Substack RSS integration for blog

### ⏳ **Pending**
- Spotify OAuth completion (user needs to authorize)
- Backend deployment to Render/Railway
- Frontend deployment to Vercel
- Domain setup
- SSL certificates (handled by platforms)
- Instagram integration (manual via Google Sheets)

### 🔄 **Next Steps**
1. Create deployment branches
2. Remove sensitive files from git
3. Deploy backend first (get URL)
4. Deploy frontend (update backend URL)
5. Test production environment
6. Complete Spotify OAuth with production URLs

---

## 📝 API Credentials Needed

| Service | Status | Location |
|---------|--------|----------|
| YouTube API | ✅ Active | Frontend `.env.local` |
| Spotify API | ⏳ Pending OAuth | Frontend `.env.local` |
| Google Sheets | ⏳ Needs setup | Backend `.env` |
| Substack RSS | ✅ Active | Backend `.env` |

---

## 🌐 URLs (To be updated)

- **Frontend**: `https://your-domain.vercel.app`
- **Backend**: `https://your-backend.render.com`
- **Repository**: `https://github.com/ShirokoKun/shirokokun.portfolio.live`

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Render Deployment Guide](https://render.com/docs)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Google Sheets API](https://developers.google.com/sheets/api)

---

**Last Updated**: November 10, 2025
**Version**: 1.0.0
