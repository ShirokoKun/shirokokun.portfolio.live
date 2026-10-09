# 🚀 Railway Deployment Checklist

## ✅ Pre-Deployment Verification

### Backend Ready
- [x] TypeScript in dependencies ✅
- [x] tsconfig.json configured ✅
- [x] railway.json created ✅
- [x] PORT environment variable support ✅
- [x] CORS middleware configured ✅
- [x] Health check endpoint (/health) ✅
- [x] Build script works locally ✅

### Test Locally
```bash
cd portfolio-backend
npm run build  # Should create dist/ folder
npm start      # Should start on PORT 8080
```

---

## 🚂 Railway Deployment Steps

### 1. Create Railway Project
1. Go to https://railway.app/
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose: `ShirokoKun/shirokokun.portfolio.live`
5. Select the `main` branch

### 2. Configure Root Directory
In Railway Dashboard → Settings:
```
Root Directory: portfolio-backend
```

### 3. Add Environment Variables
Copy from `.env.railway.example` and add to Railway:

**Required Variables:**
```
NODE_ENV=production
PORT=8080
ALLOWED_ORIGINS=https://your-vercel-url.vercel.app
```

**Google Sheets (Contact Form):**
```
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GOOGLE_SHEETS_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
SPREADSHEET_ID=your_sheet_id
SHEET_NAME=Responses
```

**Email (Gmail SMTP):**
```
EMAIL_USER=your.email@gmail.com
EMAIL_APP_PASSWORD=your_16_digit_app_password
EMAIL_TO=recipient@example.com
```

**Spotify API:**
```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=(get after deployment)
SPOTIFY_REDIRECT_URI=https://your-railway-url.railway.app/api/spotify/callback
```

### 4. Deploy
Click "Deploy" and watch the logs.

Expected output:
```
✓ npm install
✓ npm run build (creates dist/)
✓ npm start
✓ Server running on port 8080
```

### 5. Get Railway URL
After deployment, Railway will provide a URL like:
```
https://portfolio-backend-production-xxxx.up.railway.app
```

### 6. Test Endpoints
```bash
# Health check
curl https://your-railway-url.railway.app/health

# API root
curl https://your-railway-url.railway.app/

# Blog posts
curl https://your-railway-url.railway.app/api/blog/posts
```

---

## 🎵 Spotify Setup (After Deployment)

### 1. Update Spotify App Settings
1. Go to https://developer.spotify.com/dashboard
2. Edit your app
3. Update Redirect URI:
   ```
   https://your-railway-url.railway.app/api/spotify/callback
   ```

### 2. Get Refresh Token
1. Visit: `https://your-railway-url.railway.app/api/spotify/auth`
2. Copy the authorization URL
3. Visit it and authorize
4. You'll be redirected to `/api/spotify/callback`
5. Copy the `refresh_token` from the response

### 3. Add Refresh Token to Railway
Add environment variable:
```
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here
```

### 4. Redeploy
Railway will auto-redeploy with the new token.

---

## 🌐 Frontend Integration (Vercel)

### Update Frontend Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```env
# Backend API URL (Railway)
NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app

# Spotify (for client-side components)
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id

# YouTube
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=your_channel_id

# Instagram (if using)
INSTAGRAM_ACCESS_TOKEN=your_instagram_token
INSTAGRAM_USER_ID=your_user_id
```

### Redeploy Frontend
After adding variables, redeploy on Vercel.

---

## 🧪 Post-Deployment Testing

### Backend Tests
- [ ] Health check works: `/health`
- [ ] API root returns endpoints: `/`
- [ ] Blog posts load: `/api/blog/posts`
- [ ] Contact form submits: `POST /api/contact`
- [ ] CORS allows frontend domain

### Frontend Tests
- [ ] Homepage loads
- [ ] Blog posts display
- [ ] Contact form works
- [ ] Spotify widget shows now playing
- [ ] YouTube videos load

### Integration Tests
- [ ] Contact form submission goes to Google Sheets
- [ ] Email notifications sent
- [ ] Spotify updates in real-time
- [ ] No CORS errors in browser console

---

## 🐛 Troubleshooting

### Build Fails: "tsc: not found"
✅ Already fixed - TypeScript is in dependencies

### Runtime Error: "Cannot find module"
Check that all imports are correct and tsconfig paths match

### CORS Error
Update `ALLOWED_ORIGINS` to include your Vercel URL:
```
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://www.your-domain.com
```

### Port Error
Railway automatically sets PORT - don't hardcode it

### Google Sheets Error
1. Check private key format (keep \n newlines)
2. Share sheet with service account email
3. Check Sheet name matches SHEET_NAME env var

### Spotify Not Working
1. Get refresh token AFTER deployment
2. Update redirect URI in Spotify dashboard
3. Re-authorize if token expires

---

## 📊 Monitoring

### Railway Logs
View real-time logs in Railway dashboard to debug issues

### Metrics to Watch
- Response times
- Error rates
- Memory usage
- API request count

---

## 🎯 Success Criteria

✅ Backend deploys without errors
✅ All endpoints respond correctly
✅ Frontend can call backend APIs
✅ Contact form submissions work
✅ Spotify widget updates
✅ No CORS errors
✅ Google Sheets integration works

---

## 🔄 Future Updates

To update the backend:
```bash
# Make changes locally
git add .
git commit -m "Update backend"
git push origin main

# Railway auto-deploys from main branch
```

---

**Your backend is now production-ready!** 🎉
