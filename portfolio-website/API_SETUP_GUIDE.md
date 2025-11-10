# API Integration Setup Guide

This guide will help you set up Spotify, Instagram, and YouTube API integrations for your portfolio.

---

## 🎵 Spotify API Setup

### Step 1: Create a Spotify App
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click **"Create App"**
4. Fill in:
   - **App Name**: "My Portfolio"
   - **App Description**: "Personal portfolio Spotify integration"
   - **Redirect URI**: `http://localhost:3001/api/auth/callback/spotify`
   - Check the boxes for Terms of Service
5. Click **"Save"**

### Step 2: Get Your Credentials
1. In your app dashboard, click **"Settings"**
2. Copy your **Client ID** and **Client Secret**

### Step 3: Get Refresh Token
1. Create this authorization URL (replace `YOUR_CLIENT_ID`):
   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3001/api/auth/callback/spotify&scope=user-read-currently-playing%20user-read-recently-played
   ```
2. Open it in browser and authorize
3. You'll be redirected to a URL like: `http://localhost:3001/api/auth/callback/spotify?code=XXXXX`
4. Copy the `code` value
5. Use this code to get refresh token using curl:
   ```bash
   curl -X POST https://accounts.spotify.com/api/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=authorization_code" \
     -d "code=YOUR_CODE" \
     -d "redirect_uri=http://localhost:3001/api/auth/callback/spotify" \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET"
   ```
6. Copy the `refresh_token` from the response

### Step 4: Add to .env.local
```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here
```

---

## 📱 Instagram API Setup

### Step 1: Create a Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Consumer"** as app type
4. Fill in app details and create

### Step 2: Add Instagram Basic Display
1. In your app dashboard, go to **"Add Product"**
2. Find **"Instagram Basic Display"** and click **"Set Up"**
3. Click **"Create New App"** in Instagram Basic Display
4. Fill in:
   - **Display Name**: "My Portfolio"
   - **Valid OAuth Redirect URIs**: `https://localhost:3001/`
   - **Deauthorize Callback URL**: `https://localhost:3001/`
   - **Data Deletion Request URL**: `https://localhost:3001/`
5. Save changes

### Step 3: Add Instagram Tester
1. Go to **"Roles"** → **"Instagram Testers"**
2. Click **"Add Instagram Testers"**
3. Enter your Instagram username
4. Open Instagram app → **Settings** → **Apps and Websites** → **Tester Invites** → Accept

### Step 4: Get Access Token
1. Create authorization URL (replace values):
   ```
   https://api.instagram.com/oauth/authorize?client_id=YOUR_APP_ID&redirect_uri=https://localhost:3001/&scope=user_profile,user_media&response_type=code
   ```
2. Open in browser and authorize
3. You'll get a code in the URL
4. Exchange code for token:
   ```bash
   curl -X POST https://api.instagram.com/oauth/access_token \
     -F "client_id=YOUR_APP_ID" \
     -F "client_secret=YOUR_APP_SECRET" \
     -F "grant_type=authorization_code" \
     -F "redirect_uri=https://localhost:3001/" \
     -F "code=YOUR_CODE"
   ```
5. Get long-lived token (valid for 60 days):
   ```bash
   curl -X GET "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=YOUR_APP_SECRET&access_token=YOUR_SHORT_LIVED_TOKEN"
   ```

### Step 5: Get Your Instagram User ID
```bash
curl -X GET "https://graph.instagram.com/me?fields=id,username&access_token=YOUR_ACCESS_TOKEN"
```

### Step 6: Add to .env.local
```env
INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token_here
INSTAGRAM_USER_ID=your_instagram_user_id_here
```

**Note**: Instagram access tokens expire after 60 days. You'll need to refresh them periodically.

---

## 📺 YouTube API Setup

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name it "Portfolio Website" and create

### Step 2: Enable YouTube Data API
1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"YouTube Data API v3"**
3. Click on it and press **"Enable"**

### Step 3: Create API Credentials
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API Key"**
3. Copy your API key
4. Click **"Restrict Key"** (recommended)
5. Under **"API restrictions"**, select **"Restrict key"**
6. Choose **"YouTube Data API v3"**
7. Save

### Step 4: Get Your Channel ID
1. Go to your YouTube channel
2. Click on your profile picture → **"Settings"** → **"Advanced settings"**
3. Copy your **Channel ID**

OR

1. Go to your channel URL: `https://www.youtube.com/channel/YOUR_CHANNEL_ID`
2. The ID is in the URL

OR (if you have a custom URL):
```bash
curl "https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=YOUR_USERNAME&key=YOUR_API_KEY"
```

### Step 5: Add to .env.local
```env
YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_CHANNEL_ID=your_channel_id_here
```

---

## 🚀 Final Steps

### 1. Create/Update .env.local file
Create a file named `.env.local` in your project root (`portfolio-website/.env.local`):

```env
# Spotify
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here

# Instagram
INSTAGRAM_ACCESS_TOKEN=your_access_token_here
INSTAGRAM_USER_ID=your_user_id_here

# YouTube
YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_CHANNEL_ID=your_channel_id_here
```

### 2. Restart your development server
```bash
npm run dev
```

### 3. Test the APIs
Visit these endpoints to verify:
- `http://localhost:3001/api/spotify/now-playing`
- `http://localhost:3001/api/spotify/recently-played`
- `http://localhost:3001/api/instagram/reels`
- `http://localhost:3001/api/youtube/videos`

---

## 📋 Quick Links Reference

**Your URLs to share:**
- Instagram Profile: `https://www.instagram.com/YOUR_USERNAME/`
- Spotify Profile: `https://open.spotify.com/user/YOUR_USER_ID`
- YouTube Channel: `https://www.youtube.com/channel/YOUR_CHANNEL_ID`

---

## 🔄 Token Refresh

### Spotify
✅ Tokens refresh automatically using the refresh_token

### Instagram
⚠️ Tokens expire after 60 days. To refresh:
```bash
curl -X GET "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=YOUR_CURRENT_TOKEN"
```

### YouTube
✅ API key doesn't expire (unless you regenerate it)

---

## 🐛 Troubleshooting

### Spotify not showing current song
- Make sure you're actively playing music on Spotify
- Check if your Spotify account is set to private listening (disable it)

### Instagram not showing reels
- Make sure you've accepted the tester invite
- Check if your account is public or has reels
- Verify the access token hasn't expired

### YouTube not showing videos
- Check if your channel has public videos
- Verify API key restrictions aren't blocking localhost
- Check if you've exceeded daily quota (10,000 units/day)

---

## 📞 Need Help?

Share with me:
1. Your Instagram username or profile URL
2. Your Spotify profile URL
3. Your YouTube channel URL

I'll help you configure everything! 🚀
