# 🚀 Quick Deployment Reference

## 📋 Git Commands

```bash
# 1. Commit everything to main
git add .
git commit -m "chore: prepare for deployment"
git push origin main

# 2. Create backend branch
git checkout -b backend-deploy
git push origin backend-deploy

# 3. Create frontend branch  
git checkout main
git checkout -b frontend-deploy
git push origin frontend-deploy
```

## 🔐 Environment Variables

### Frontend (Vercel)
```
YOUTUBE_API_KEY=AIzaSyA-Jc03T8tNIEDOyIe4pqezJQ26FBGv-MY
YOUTUBE_CHANNEL_ID=UCobGcfjAgSJqgZaHFAuzkKg
SPOTIFY_CLIENT_ID=74fe9c8bf8d14a2996e07536ca733a6f
SPOTIFY_CLIENT_SECRET=679ad78855e148e2ae78090454e25c02
SPOTIFY_REFRESH_TOKEN=[after-oauth]
NEXT_PUBLIC_BACKEND_URL=[your-backend-url]
```

### Backend (Render)
```
PORT=8080
NODE_ENV=production
ALLOWED_ORIGINS=[your-frontend-url]
SUBSTACK_RSS_URL=https://shirokokun.substack.com/feed
GOOGLE_SERVICE_ACCOUNT_EMAIL=[your-email]
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=[your-key]
GOOGLE_SHEETS_ID=[your-sheet-id]
GOOGLE_SHEETS_RANGE=Responses!A:E
CACHE_TTL=1800
```

## 🏗️ Deployment Settings

### Render (Backend)
- **Branch**: `backend-deploy`
- **Root Directory**: `portfolio-backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Vercel (Frontend)
- **Branch**: `frontend-deploy`
- **Framework**: `Next.js`
- **Root Directory**: `portfolio-website`

## 🔗 URLs to Update

After backend deployment:
- Update `NEXT_PUBLIC_BACKEND_URL` in Vercel → Frontend env vars

After frontend deployment:
- Update `ALLOWED_ORIGINS` in Render → Backend env vars

## ✅ Test URLs

```bash
# Blog API
https://your-backend.com/api/blog

# Contact API
https://your-backend.com/api/contact

# Spotify Auth
https://your-frontend.com/api/spotify/auth
```

## 📞 Support Links

- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
- Google Cloud: https://console.cloud.google.com/
- Spotify Dev: https://developer.spotify.com/dashboard

## ⏱️ Timeline

1. Commit code → **5 min**
2. Get Google credentials → **15 min**
3. Deploy backend → **20 min**
4. Deploy frontend → **20 min**
5. Update CORS → **5 min**
6. Test → **15 min**

**Total: ~80 minutes**
