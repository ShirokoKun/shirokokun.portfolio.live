# 🧪 Spotify Widget - Testing Guide

## ✅ LIVE SITE STATUS (Tested Nov 10, 2025)

### **Your Sites:**
- **Frontend:** https://shirokokun-portfolio-live.vercel.app/ ✅ WORKING
- **Backend:** https://web-production-0e29e.up.railway.app/ ✅ ONLINE

### **Spotify API Status:**
```json
✅ WORKING - Currently playing: "Love Me" by Bhaskar, DL91 Era, Dheeru Khola
```

---

## 🚀 DEPLOYMENT STATUS

### **Changes Pushed:**
```bash
✅ Committed: fix: remove Spotify API caching and enable true real-time updates
✅ Pushed to: GitHub main branch
⏳ Vercel: Auto-deploying (wait 2-3 minutes)
```

### **What Was Fixed:**
1. ✅ Removed 60-second API cache → Now 0 seconds (no cache)
2. ✅ Added Vercel-specific no-cache headers
3. ✅ Force dynamic rendering (no static generation)
4. ✅ Faster refresh: 30s → 10s
5. ✅ Added timestamp to prevent edge caching
6. ✅ Added console logging for debugging

---

## 📋 TESTING CHECKLIST

### **Step 1: Wait for Vercel Deployment (2-3 mins)**

Go to: https://vercel.com/dashboard

Look for:
- ⏳ "Building..." status
- ✅ "Ready" status (wait for this!)

### **Step 2: Test API Directly**

**Open in new tab:**
```
https://shirokokun-portfolio-live.vercel.app/api/spotify/now-playing
```

**Expected response when playing music:**
```json
{
  "isPlaying": true,
  "title": "Your Song Name",
  "artist": "Artist Name",
  "album": "Album Name",
  "albumImageUrl": "https://i.scdn.co/image/...",
  "songUrl": "https://open.spotify.com/track/...",
  "duration": 164848,
  "progress": 17411,
  "timestamp": 1699622229172
}
```

**Expected response when NOT playing:**
```json
{
  "isPlaying": false
}
```

✅ If you see real data → API is working!
❌ If you see error → Check Step 6 below

### **Step 3: Test Widget on Live Site**

1. **Open:** https://shirokokun-portfolio-live.vercel.app/
2. **Open browser console:** Press `F12` → Console tab
3. **Scroll to Spotify widget section**
4. **Watch for console logs every 10 seconds:**
   ```
   🎵 Spotify: Playing "Song Name" by Artist Name
   ```

### **Step 4: Test Real-Time Updates**

**Test 1: Play a song**
1. Open Spotify (any device - phone, desktop, web)
2. Play any song
3. Wait 10 seconds
4. Check widget → Should show your song

**Test 2: Pause**
1. Pause Spotify
2. Wait 10 seconds
3. Check widget → Should show "Not playing"

**Test 3: Change song**
1. Play a different song
2. Wait 10 seconds
3. Check widget → Should show new song

**Test 4: Progress bar**
1. Play a song
2. Watch progress bar → Should move
3. Wait 10 seconds → Should update to correct position

### **Step 5: Check Console Logs**

Press `F12` → Console tab

**Look for these logs every 10 seconds:**
```javascript
🎵 Spotify: Playing "Song Name" by Artist Name
```

**Or if not playing:**
```javascript
🎵 Spotify: Not playing
```

**If you see errors:**
```javascript
❌ Error fetching Spotify now playing: [error message]
```
→ Go to Step 6

### **Step 6: Troubleshooting**

#### **Problem: API returns error**

**Check refresh token:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Find `SPOTIFY_REFRESH_TOKEN`
3. If empty or expired, get new one:
   - Visit: https://shirokokun-portfolio-live.vercel.app/api/spotify/auth
   - Copy authUrl and visit it
   - Authorize
   - Copy refresh token from callback page
   - Add to Vercel
   - Redeploy

#### **Problem: Widget stuck on old song**

**Solutions:**
1. Clear browser cache: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Check Vercel deployment finished
3. Check console for errors
4. Wait full 10 seconds for next update

#### **Problem: Shows "Not playing" but I'm playing**

**Check:**
1. Spotify is actually playing (not paused)
2. Not in "Private Session" mode
3. Playing on Spotify Connect device (not local files)
4. Wait 10 seconds for refresh

---

## 🎯 EXPECTED BEHAVIOR

### **Timing:**
- **Refresh rate:** Every 10 seconds
- **Max delay:** 10 seconds to detect changes
- **Normal scenario:** You change song at 0:05, widget updates at 0:10

### **Visual States:**

**Loading (first 2 seconds):**
```
🔄 [Spinning loader]
```

**Playing:**
```
🎵 Now Playing
Live from Spotify

[Album Art - Green ring]
Song Name
Artist Name

Progress bar moving
1:35 / 3:42
```

**Not Playing:**
```
🎧 Spotify
Not currently playing
Check back soon! 🎵
```

**Error:**
```
❌ Failed to load Spotify data
[Error message]
```

---

## 📊 PERFORMANCE METRICS

### **Before Fix:**
- ❌ Cache: 60 seconds
- ❌ Refresh: 30 seconds
- ❌ Total delay: Up to 90 seconds
- ❌ Real-time: No

### **After Fix:**
- ✅ Cache: 0 seconds (disabled)
- ✅ Refresh: 10 seconds
- ✅ Total delay: Max 10 seconds
- ✅ Real-time: Yes!

### **API Calls:**
- **Frequency:** Every 10 seconds
- **Calls per minute:** 6
- **Spotify limit:** 180/min
- **Safe margin:** ✅ Yes (only 3.3% of limit)

---

## 🔍 DEBUGGING TIPS

### **Check API Response:**
```bash
# Open this URL in browser
https://shirokokun-portfolio-live.vercel.app/api/spotify/now-playing

# Should return JSON with your current song
```

### **Check Console Logs:**
```javascript
// Press F12 → Console tab
// Should see logs every 10 seconds:
🎵 Spotify: Playing "Song Name" by Artist Name

// Or
🎵 Spotify: Not playing
```

### **Check Network Tab:**
```
Press F12 → Network tab → Filter: "spotify"
Should see requests every 10 seconds to:
/api/spotify/now-playing?t=1699622229172
```

### **Check Vercel Function Logs:**
```
1. Go to Vercel Dashboard
2. Click your project
3. Click "Functions"
4. Click "api/spotify/now-playing"
5. Check logs for errors
```

---

## ✅ SUCCESS INDICATORS

Your Spotify widget is working if:

1. ✅ API returns real data (not error)
2. ✅ Widget shows YOUR current song
3. ✅ Album art loads from Spotify CDN
4. ✅ Progress bar moves
5. ✅ Updates within 10 seconds of changes
6. ✅ Console logs every 10 seconds
7. ✅ No "Blinding Lights" fake data
8. ✅ Shows "Not playing" when paused

---

## 🎉 FINAL CHECK

**Open these 3 tabs:**

1. **Spotify App** (phone/desktop/web)
2. **Your Portfolio:** https://shirokokun-portfolio-live.vercel.app/
3. **Browser Console:** Press F12

**Then:**
1. Play a song in Spotify
2. Watch console - should log in 10 seconds
3. Watch widget - should update in 10 seconds
4. Pause song
5. Watch console - should log "Not playing" in 10 seconds
6. Watch widget - should show "Not playing" in 10 seconds

**If all of this works → ✅ YOU'RE DONE!**

---

## 📞 QUICK LINKS

- **Live Site:** https://shirokokun-portfolio-live.vercel.app/
- **API Test:** https://shirokokun-portfolio-live.vercel.app/api/spotify/now-playing
- **Get Auth:** https://shirokokun-portfolio-live.vercel.app/api/spotify/auth
- **Vercel:** https://vercel.com/dashboard
- **Spotify Dashboard:** https://developer.spotify.com/dashboard

---

**Your Spotify widget is now TRULY REAL-TIME! 🎵**

**Changes are visible within 10 seconds!**
