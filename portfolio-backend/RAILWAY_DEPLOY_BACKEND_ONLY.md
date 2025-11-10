# 🚂 Railway Backend Deployment - CORRECT CONFIGURATION

## ⚠️ CRITICAL: Backend Only on Railway

Railway should ONLY build and deploy the backend. Frontend stays on Vercel.

---

## ✅ CORRECT Railway Settings

### In Railway Dashboard → Settings:

```
Root Directory: portfolio-backend

Build Command: npm install && npm run build

Start Command: npm start

Watch Paths: portfolio-backend/**
```

---

## 🎯 Why This Configuration?

**Problem:** Monorepo structure with backend + frontend
**Solution:** Tell Railway to only look at backend folder

When you set `Root Directory: portfolio-backend`:
- Railway treats `portfolio-backend/` as the project root
- Looks for `package.json` inside that folder
- Installs dependencies from there (includes TypeScript)
- Builds only the backend
- Ignores frontend completely ✨

---

## 📋 Step-by-Step Setup

### 1. Create Railway Service

1. Go to https://railway.app/
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose: `ShirokoKun/shirokokun.portfolio.live`
5. Branch: `main`

### 2. Configure Service Settings

Click **Settings** (gear icon) and set:

**Deploy Settings:**
```
Root Directory: portfolio-backend
Build Command: (leave empty - uses npm run build from package.json)
Start Command: (leave empty - uses npm start from package.json)
```

**Watch Paths (Optional):**
```
portfolio-backend/**
```
This makes Railway only redeploy when backend changes.

### 3. Add Environment Variables

Click **"Variables"** tab and add:

#### Required Backend Variables:

```bash
# Server
NODE_ENV=production
PORT=8080

# CORS - Add your Vercel URL
ALLOWED_ORIGINS=https://your-vercel-url.vercel.app,http://localhost:3000

# Google Sheets (Contact Form)
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Key_Here\n-----END PRIVATE KEY-----"
GOOGLE_SHEETS_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
SPREADSHEET_ID=your_spreadsheet_id
SHEET_NAME=Responses

# Email (Gmail SMTP)
EMAIL_USER=your.email@gmail.com
EMAIL_APP_PASSWORD=your_16_char_app_password
EMAIL_TO=recipient@example.com

# Spotify API (get refresh token after deployment)
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=https://your-railway-url.up.railway.app/api/spotify/callback
```

### 4. Deploy

Click **"Deploy"** button.

Watch the build logs - should see:
```
✓ Building from portfolio-backend/
✓ npm install
✓ npm run build (tsc compiles TypeScript)
✓ npm start
✓ Server running on port 8080
✓ Deployment successful!
```

### 5. Get Your Railway URL

After deployment, you'll get a URL like:
```
https://portfolio-backend-production-xxxx.up.railway.app
```

Copy this URL - you'll need it for frontend configuration.

---

## 🎵 Spotify Setup (After Deployment)

### Step 1: Update Spotify Dashboard

1. Go to https://developer.spotify.com/dashboard
2. Edit your app
3. Update **Redirect URIs** to include:
   ```
   https://your-railway-url.up.railway.app/api/spotify/callback
   ```

### Step 2: Get Refresh Token

1. Visit: `https://your-railway-url.up.railway.app/api/spotify/auth`
2. Copy the `authUrl` from response
3. Visit that URL in browser
4. Authorize your Spotify account
5. You'll be redirected to `/api/spotify/callback`
6. Copy the `refresh_token` from the response

### Step 3: Add Refresh Token

In Railway Variables, add:
```
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here
```

Railway will auto-redeploy with the new token.

---

## 🌐 Connect Frontend (Vercel)

### Update Vercel Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```bash
# Backend API URL (Railway)
NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app

# Spotify (Client-side)
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id

# YouTube
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=your_channel_id
```

### Redeploy Frontend

After adding variables, redeploy your Vercel site.

---

## ✅ Verification Checklist

### Backend Tests (Railway)

Test these endpoints:

```bash
# Health check
curl https://your-railway-url.up.railway.app/health

# API info
curl https://your-railway-url.up.railway.app/

# Blog posts
curl https://your-railway-url.up.railway.app/api/blog/posts
```

### Frontend Tests (Vercel)

- [ ] Homepage loads
- [ ] Blog section displays posts
- [ ] Contact form works (check Google Sheets)
- [ ] Spotify widget shows current song
- [ ] YouTube videos load
- [ ] No CORS errors in console

---

## 🐛 Troubleshooting

### Build Error: "tsc: not found"
✅ **Fixed!** Set Root Directory to `portfolio-backend`

### Build Error: Next.js errors
✅ **Fixed!** Frontend not building on Railway anymore

### Runtime Error: CORS
Update `ALLOWED_ORIGINS` in Railway to include your Vercel domain

### Runtime Error: "Cannot find module"
Check TypeScript compilation - ensure `dist/` folder is created

### Spotify Not Working
1. Verify redirect URI in Spotify dashboard
2. Check refresh token is set in Railway
3. Test: `curl https://your-railway-url.up.railway.app/api/spotify/auth`

---

## 📊 Expected Build Output

When Railway builds correctly, you'll see:

```bash
[Build]
→ Using root directory: portfolio-backend
→ Running: npm install
✓ Installing dependencies...
✓ typescript@5.3.3
✓ @types/node@20.10.5
✓ express@4.18.2
✓ All dependencies installed

→ Running: npm run build
✓ Compiling TypeScript...
✓ Creating dist/index.js
✓ Build completed successfully

[Deploy]
→ Running: npm start
✓ Server starting...
✓ 🚀 Server running on port 8080
✓ 📝 Environment: production
✓ 🌐 Health check: /health
✓ Deployment successful!
```

---

## 🎯 Summary

**DO:**
- ✅ Set Root Directory to `portfolio-backend`
- ✅ Deploy backend on Railway
- ✅ Deploy frontend on Vercel
- ✅ Connect them via environment variables

**DON'T:**
- ❌ Build frontend on Railway
- ❌ Leave Root Directory empty
- ❌ Try to deploy both in one service

---

**With this configuration, your Railway deployment will succeed!** 🎉
