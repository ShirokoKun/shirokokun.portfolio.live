# 🎵 Spotify Integration Setup Guide

## ⚡ Quick Overview

Your Spotify integration runs on the **FRONTEND (Vercel)**, not the backend (Railway).

**Architecture:**
```
User → Vercel Frontend → Spotify API
     ↳ /api/spotify/auth
     ↳ /api/spotify/callback
     ↳ /api/spotify/now-playing
```

---

## 📋 Step 1: Spotify Developer Dashboard

### 1.1 Create/Edit Your App

1. Go to https://developer.spotify.com/dashboard
2. Log in with your Spotify account
3. Click on your app: **portfolio-dashboard**
4. Click **Settings**

### 1.2 Add Redirect URIs

**IMPORTANT:** Add BOTH of these URLs:

```
http://localhost:3000/api/spotify/callback
https://your-vercel-url.vercel.app/api/spotify/callback
```

**To add them:**
1. Click "Edit Settings"
2. Scroll to "Redirect URIs"
3. Click "ADD"
4. Paste the first URI: `http://localhost:3000/api/spotify/callback`
5. Click "ADD" again
6. Paste the second URI (replace with your actual Vercel URL)
7. Scroll down and click **"SAVE"**

### 1.3 Get Your Credentials

Still in Settings:
- **Client ID**: Copy this (it's visible)
- **Client Secret**: Click "View client secret" → Copy it

---

## 🔧 Step 2: Add to Vercel Environment Variables

### 2.1 In Vercel Dashboard

1. Go to your Vercel project
2. Click **Settings** tab
3. Click **Environment Variables**
4. Add these three variables:

```bash
# Variable 1
Name: SPOTIFY_CLIENT_ID
Value: paste_your_client_id_here

# Variable 2
Name: SPOTIFY_CLIENT_SECRET
Value: paste_your_client_secret_here

# Variable 3
Name: SPOTIFY_REFRESH_TOKEN
Value: (leave empty for now - we'll get this in next step)
```

5. **Important**: Select "Production", "Preview", and "Development" for each variable
6. Click **Save** for each

### 2.2 Redeploy

After adding Client ID and Secret:
1. Go to **Deployments** tab
2. Click **⋮** on latest deployment
3. Click **Redeploy**
4. Wait for deployment to finish

---

## 🎫 Step 3: Get Refresh Token (One-Time Setup)

### 3.1 Start the Authorization Flow

**After Vercel redeploys**, visit this URL in your browser:

```
https://your-vercel-url.vercel.app/api/spotify/auth
```

You'll see a JSON response with an `authUrl`. Copy that URL.

### 3.2 Authorize Your Account

1. Paste the `authUrl` into your browser
2. Log in to Spotify (if not already)
3. Click **"Agree"** to authorize the app
4. You'll be redirected to `/api/spotify/callback`

### 3.3 Copy the Refresh Token

You'll see a beautiful page with two tokens:
- **Refresh Token** (never expires) ← **This is what you need!**
- **Access Token** (expires in 1 hour)

Click the **"📋 Copy"** button next to the Refresh Token.

### 3.4 Add Refresh Token to Vercel

1. Go back to Vercel Dashboard → Settings → Environment Variables
2. Find `SPOTIFY_REFRESH_TOKEN`
3. Click **Edit**
4. Paste the refresh token
5. Click **Save**

### 3.5 Final Redeploy

Vercel will automatically redeploy with the new token.

---

## ✅ Step 4: Verify It Works

### 4.1 Test Now Playing Endpoint

Visit:
```
https://your-vercel-url.vercel.app/api/spotify/now-playing
```

**If you're listening to Spotify:**
You'll see JSON with:
```json
{
  "isPlaying": true,
  "title": "Song Name",
  "artist": "Artist Name",
  "album": "Album Name",
  "albumImageUrl": "https://...",
  "songUrl": "https://open.spotify.com/track/..."
}
```

**If nothing is playing:**
```json
{
  "isPlaying": false
}
```

### 4.2 Test Recently Played

Visit:
```
https://your-vercel-url.vercel.app/api/spotify/recently-played
```

You should see your last 20 played tracks.

---

## 📝 For Local Development

### .env.local (portfolio-website folder)

Create `portfolio-website/.env.local`:

```bash
# Spotify API Credentials
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here

# Other frontend variables
YOUTUBE_API_KEY=your_youtube_key
YOUTUBE_CHANNEL_ID=your_channel_id
```

---

## 🐛 Troubleshooting

### Error: "Invalid redirect URI"

**Problem:** The redirect URI in your Spotify Dashboard doesn't match what the app is using.

**Solution:**
1. Visit: `https://your-vercel-url.vercel.app/api/spotify/auth`
2. Check the `redirectUri` value in the response
3. Make sure EXACTLY that URI is in your Spotify Dashboard
4. No trailing slashes!
5. Click "SAVE" in Spotify Dashboard

### Error: "Invalid client"

**Problem:** Client ID or Secret is wrong or not set in Vercel.

**Solution:**
1. Check Vercel Environment Variables
2. Make sure `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are set
3. Verify they match what's in Spotify Dashboard (Settings)
4. Redeploy after adding/fixing

### Error: "Refresh token not configured"

**Problem:** You haven't completed Step 3 yet.

**Solution:**
1. Make sure Client ID and Secret are in Vercel first
2. Redeploy
3. Then visit `/api/spotify/auth` to get refresh token
4. Add refresh token to Vercel
5. Redeploy again

### Widget Shows "Not Playing"

**Possible causes:**
1. Nothing is actually playing on Spotify
2. Refresh token expired (rare, but possible)
3. Spotify account changed

**Solution:**
- Start playing something on Spotify
- Make sure you're logged into the same account
- If still not working, get a new refresh token (repeat Step 3)

### Authorization URL Doesn't Work

**Problem:** The auth URL leads to a Spotify error page.

**Solution:**
1. Make sure the redirect URI is in Spotify Dashboard
2. Check Client ID is correct in Vercel
3. Try visiting `/api/spotify/auth` again to get a fresh URL

---

## 📊 Complete Environment Variables Checklist

### Vercel (Frontend)

```bash
# Spotify
✅ SPOTIFY_CLIENT_ID=...
✅ SPOTIFY_CLIENT_SECRET=...
✅ SPOTIFY_REFRESH_TOKEN=...

# YouTube (if using)
✅ YOUTUBE_API_KEY=...
✅ YOUTUBE_CHANNEL_ID=...

# Backend API (if using Railway backend)
✅ NEXT_PUBLIC_API_URL=https://web-production-0e29e.up.railway.app
```

### Spotify Dashboard Settings

```
✅ App Name: portfolio-dashboard
✅ Redirect URIs:
   - http://localhost:3000/api/spotify/callback
   - https://your-vercel-url.vercel.app/api/spotify/callback
✅ Client ID: (copied to Vercel)
✅ Client Secret: (copied to Vercel)
```

---

## 🎯 Quick Reference

### Your URLs

**Local Development:**
- Auth: `http://localhost:3000/api/spotify/auth`
- Callback: `http://localhost:3000/api/spotify/callback`
- Now Playing: `http://localhost:3000/api/spotify/now-playing`

**Production (Vercel):**
- Auth: `https://your-vercel-url.vercel.app/api/spotify/auth`
- Callback: `https://your-vercel-url.vercel.app/api/spotify/callback`
- Now Playing: `https://your-vercel-url.vercel.app/api/spotify/now-playing`

### Spotify Dashboard

- Dashboard: https://developer.spotify.com/dashboard
- Your App: Click "portfolio-dashboard"
- Settings: Click "Settings" button

---

## 🔄 Summary: Complete Setup Flow

1. ✅ **Spotify Dashboard**
   - Add both redirect URIs (localhost + Vercel)
   - Copy Client ID and Secret

2. ✅ **Vercel Environment Variables**
   - Add SPOTIFY_CLIENT_ID
   - Add SPOTIFY_CLIENT_SECRET
   - Redeploy

3. ✅ **Get Refresh Token**
   - Visit `/api/spotify/auth`
   - Authorize on Spotify
   - Copy refresh token from callback page

4. ✅ **Add Refresh Token to Vercel**
   - Add SPOTIFY_REFRESH_TOKEN
   - Redeploy

5. ✅ **Test**
   - Visit `/api/spotify/now-playing`
   - Should see current song data!

---

**The key difference:** Your backend (Railway) handles contact forms and blog. Your frontend (Vercel) handles Spotify directly! 🎵
