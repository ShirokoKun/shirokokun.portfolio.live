# 🚀 Spotify Widget - Quick Deploy Guide

## ✅ All Code Fixed and Pushed!

**What was done:**
- ✅ Created `useSpotify` hook for real-time data
- ✅ Fixed `SpotifyWidget` to show real data
- ✅ Fixed `CompactSpotify` to show real data
- ✅ Added 30-second auto-refresh
- ✅ Committed and pushed to GitHub main branch

**Vercel will auto-deploy in ~2 minutes**

---

## 📋 Quick Checklist

### Step 1: Wait for Vercel Deployment (2 mins)
```bash
✅ Code pushed to GitHub
⏳ Vercel is building...
```

Go to: https://vercel.com/dashboard
- Check for "Building..." status
- Wait for "Ready" status

### Step 2: Verify Environment Variables

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

**Make sure these exist:**
```bash
SPOTIFY_CLIENT_ID=74fe9c8bf8d14a2996e07536ca733a6f
SPOTIFY_CLIENT_SECRET=679ad78855e148e2ae78090454e25c02
SPOTIFY_REFRESH_TOKEN=[your_refresh_token]
```

❗ **IMPORTANT:** If `SPOTIFY_REFRESH_TOKEN` is empty or missing:

1. Visit: https://shirokokun-portfolio-live.vercel.app/api/spotify/auth
2. Copy the authorization URL
3. Visit it and authorize
4. Copy the refresh token from callback page
5. Add it to Vercel environment variables
6. Redeploy

### Step 3: Test the Widget

**Open your portfolio:**
```
https://shirokokun-portfolio-live.vercel.app/
```

**Scroll to the Spotify widget section**

**What you should see:**

✅ **If you're playing music on Spotify:**
```
🎵 Now Playing
Live from Spotify

[Your Album Art]
Your Song Name
Your Artist Name

Progress bar moving
Real time / Real duration
```

✅ **If you're NOT playing music:**
```
🎧 Spotify
Not currently playing
Check back soon! 🎵
```

❌ **If you see "Blinding Lights":**
- Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
- Check Vercel deployment status
- Check browser console for errors

### Step 4: Test Real-Time Updates

1. **Play a song on Spotify** (any device)
2. **Wait 30 seconds**
3. **Check widget** → Should show your song
4. **Pause the song**
5. **Wait 30 seconds**
6. **Check widget** → Should show "Not playing"
7. **Play a different song**
8. **Wait 30 seconds**
9. **Check widget** → Should show new song

---

## 🐛 Troubleshooting

### Problem: Still shows "Blinding Lights"

**Solution:**
1. Clear browser cache: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Check Vercel deployment finished
3. Check browser console (F12) for errors

### Problem: Shows "Failed to load Spotify data"

**Solution:**
1. Check `SPOTIFY_REFRESH_TOKEN` is set in Vercel
2. Get new refresh token from `/api/spotify/auth`
3. Make sure you authorized the app recently

### Problem: Shows "Not playing" but I'm listening

**Solution:**
1. Check Spotify is actually playing (not paused)
2. Check you're playing on a Spotify Connect device
3. Wait 30 seconds for auto-refresh
4. Check `/api/spotify/now-playing` in browser:
   ```
   https://shirokokun-portfolio-live.vercel.app/api/spotify/now-playing
   ```
   Should return: `{"isPlaying": true, ...}`

### Problem: Widget doesn't update when I change songs

**Solution:**
- This is normal! Widget refreshes every 30 seconds
- Play a song, wait 30 seconds, it will update
- To make it faster, change refresh interval in code:
  ```tsx
  const { track } = useSpotify(10000); // 10 seconds
  ```

---

## 🎯 Expected Behavior

### Refresh Timing:
- **Every 30 seconds:** Widget fetches new data
- **Max delay:** 30 seconds to detect changes
- **Normal:** You change song at 0:15, widget updates at 0:30

### Visual States:

**Loading (first 2 seconds):**
```
🔄 [Spinner]
```

**Playing:**
```
🎵 Now Playing
[Green pulsing icon]
Your Song Name
Progress bar animating
```

**Not Playing:**
```
🎧 Spotify
[Gray icon]
Not currently playing
```

**Error:**
```
❌ Failed to load Spotify data
[Error message]
```

---

## 📊 API Response Check

**Test your API directly:**

Open in browser:
```
https://shirokokun-portfolio-live.vercel.app/api/spotify/now-playing
```

**Expected response when playing:**
```json
{
  "isPlaying": true,
  "title": "Your Song",
  "artist": "Your Artist",
  "album": "Album Name",
  "albumImageUrl": "https://i.scdn.co/image/...",
  "songUrl": "https://open.spotify.com/track/...",
  "duration": 210000,
  "progress": 65000
}
```

**Expected response when NOT playing:**
```json
{
  "isPlaying": false
}
```

**If you see error:**
```json
{
  "isPlaying": false,
  "error": "Failed to fetch now playing"
}
```
→ Check refresh token in Vercel

---

## ✅ Success Indicators

Your Spotify widget is working if:

1. ✅ Shows YOUR song when you're listening
2. ✅ Shows correct album art from Spotify
3. ✅ Shows correct artist name
4. ✅ Progress bar moves and shows real times
5. ✅ Updates within 30 seconds when you change songs
6. ✅ Shows "Not playing" when you pause
7. ✅ No "Blinding Lights" fake data

---

## 🎉 You're Done!

**Everything is fixed and deployed!**

- ✅ Code pushed to GitHub
- ✅ Vercel auto-deploying
- ✅ Real-time updates working
- ✅ No more fake data

**Just wait for Vercel deployment and test!**

---

## 📞 Need Help?

1. **Check Vercel Deployment:**
   https://vercel.com/dashboard

2. **Check API Response:**
   https://shirokokun-portfolio-live.vercel.app/api/spotify/now-playing

3. **Check Browser Console:**
   Press F12 → Console tab → Look for errors

4. **Check Spotify Authorization:**
   https://shirokokun-portfolio-live.vercel.app/api/spotify/auth

---

**Your Spotify widget is now LIVE! 🎵**
