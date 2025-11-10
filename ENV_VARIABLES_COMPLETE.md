# 🔐 Environment Variables Configuration

## 📍 Your Deployment URLs

- **Frontend (Vercel)**: https://shirokokun-portfolio-live.vercel.app
- **Backend (Railway)**: https://web-production-0e29e.up.railway.app

---

## 🌐 VERCEL (Frontend) - Environment Variables

### Copy these to: Vercel Dashboard → Settings → Environment Variables

**Important:** Select **all environments** (Production, Preview, Development) for each variable.

```bash
# ============================================
# YouTube API
# ============================================
YOUTUBE_API_KEY=AIzaSyA-Jc03T8tNIEDOyIe4pqezJQ26FBGv-MY
YOUTUBE_CHANNEL_ID=UCobGcfjAgSJqgZaHFAuzkKg

# ============================================
# Spotify API
# ============================================
SPOTIFY_CLIENT_ID=74fe9c8bf8d14a2996e07536ca733a6f
SPOTIFY_CLIENT_SECRET=679ad78855e148e2ae78090454e25c02
SPOTIFY_REFRESH_TOKEN=

# 👆 IMPORTANT: Leave SPOTIFY_REFRESH_TOKEN empty for now
# Get it by visiting: https://shirokokun-portfolio-live.vercel.app/api/spotify/auth
# After you get the token, come back and add it here

# ============================================
# Google Sheets (Contact Form)
# ============================================
GOOGLE_SERVICE_ACCOUNT_EMAIL=portfolio-backend@totemic-atom-454000-r9.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQClFK90qYPZ3hsY\nOrRGAxHvw8UThCI6PH05WrEDaRE8QpY/NXvATgSc5ZSEdTPVSHgCW401YKRfd0Po\naDsPKXW+v8xl83hv5ygSRzO8WiYS6/F1fCkNBRcLCcLPDMjT0+q+VKo5FpLmMYcE\nwo7MmOaMccF/538fTV7LN8fz56Xx1wNjNf9YY3SWyuWIwUcnACbKFjuecYCuj5qg\nygO0W6Tx7mLzYvTmEh7ZM6ym6t05MVVAkNBoK/gCjTBNlyanWQYGDWsmMjtbbOp9\nXJyGJK1vdyjhcW/9aTnU24NBSBDHiW+hjPGT3Ed94K5k4abGnKhVMVp/i8sDPT42\nKsqHGG5nAgMBAAECggEARuh8NyHLO22eeMlafwo5jaIrSGdE5nvuFBFDIKJkX1yA\nuhTom6FHdPdeVIkdYxtWRTj7Djb9U+5gUndXCvu1kmJDU3WBwZtqiHNiIyEb4pvL\nYzoaTffmPn0KWzJ0Hx0TY37tgUkTf2I9y0sg2HxC54fDZIPVBGaQ9bx3nGpfyuFt\nVSm/qkLbvSDuH/IWYsc20a3vWKnVV2jsKafziQpRl6VBre/D6jkzNZwRsInhLrcv\nAKgdNPvElbirzC0IL3sGn9lbYeZnaFFdwtlwbJDLTtKGv8urFqvlSayLboPXRKuq\nKSyLEWfgBu8vfUJ54UIHOBwffq56lsPvxamz+PnO/QKBgQDmf8wZDfZE1YDM2HjD\nE+lJMVWVGBj1xNGaOYFRnmdDsuBhh4Exme6v41JWCqbfP9ALBtcm5Lwzfx+WvzYS\nrI7ETEwItLYhGI7t7EHKe+1BstqIBa14SMxi9yZyU7je4S8+60AxZVUHGSTB6smi\nyospqKwQzVmr/Il7qoVIUOu0YwKBgQC3WBtaFrtJHkYY6sYXdRN1gzYNse+rvE0+\npFSvL1LWeiKWOXJ7MifnW3wVUI6/Qt6jq7ZvXsUYhg3QE3GfCkL0oe8UZX3kLDmm\nC3U2TQvP1By3Y/Gqd5/BGoCGU3yZhoxBEIYarlFBtGsJvemW7EldJvofLdCj8Qfw\nIM5gMH4zLQKBgQDICMJsP+SoKg1kOLzctyvufCUEhewrZcptKFilJ24An30AxuME\n080D0ajDyOy2tB9tYltXgowduMYGQhzAKgagLoKRz5p7sF9h9XXHLrNhH8Fs6Fh6\nGdteS5SPBT9cFVq2JN0JwSIATf7LV2HzqAkLdzkUP9IBYuFBdGPEtY1IdwKBgQCI\nZTh77dtIiwgU81uJCeT/ECz/RTeK6FwC1RfW9/rFajkezv/23JpJCIsoBDUd3m5p\nDo57DeLM2rWd7UkiyuyCt5F3+AUO4UPF3lJFok2+QAtY9zZK3hFwA/pHdAaG5Eyk\n/tj1Mmdq3QCgT7NePsxZS2zaEyhbPi3sm0tMzeakxQKBgAQ0c5DMSw/GJ/poLO8v\n5E5x+cbg6yA4Apr/9+BnKvbP5M3KBGJqYGC4v1elXIyht92jl/Ex1Pp5X41NgFwT\nDqiA77uIj+8W/HNKBqKTneLNuNOPKN3U4DXIysDttvkQUezu/F6yST+Ed4Y8AIJx\nCQUQJBV1/ebuIBIzcO3XztvZ\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_ID=1WWf-R0i5MuNw1WzhZUGpSSvZnb1zld6MQbw5ZArc53w
GOOGLE_SHEETS_RANGE=Sheet1!A:E

# ============================================
# Email Configuration (Gmail SMTP)
# ============================================
EMAIL_USER=swastikgupta.nexboy@gmail.com
EMAIL_APP_PASSWORD=govsftdmxemjoxqh

# ============================================
# Backend API URL
# ============================================
NEXT_PUBLIC_API_URL=https://web-production-0e29e.up.railway.app

# ============================================
# Site URL
# ============================================
NEXT_PUBLIC_SITE_URL=https://shirokokun-portfolio-live.vercel.app
```

---

## 🚂 RAILWAY (Backend) - Environment Variables

### Copy these to: Railway Dashboard → Your Service → Variables

```bash
# ============================================
# Server Configuration
# ============================================
NODE_ENV=production
PORT=8080

# ============================================
# CORS Configuration
# ============================================
ALLOWED_ORIGINS=https://shirokokun-portfolio-live.vercel.app,http://localhost:3000

# ============================================
# Substack RSS Feed
# ============================================
SUBSTACK_RSS_URL=https://shirokokun.substack.com/feed

# ============================================
# Google Sheets API (Contact Form)
# ============================================
GOOGLE_SERVICE_ACCOUNT_EMAIL=portfolio-backend@totemic-atom-454000-r9.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQClFK90qYPZ3hsY\nOrRGAxHvw8UThCI6PH05WrEDaRE8QpY/NXvATgSc5ZSEdTPVSHgCW401YKRfd0Po\naDsPKXW+v8xl83hv5ygSRzO8WiYS6/F1fCkNBRcLCcLPDMjT0+q+VKo5FpLmMYcE\nwo7MmOaMccF/538fTV7LN8fz56Xx1wNjNf9YY3SWyuWIwUcnACbKFjuecYCuj5qg\nygO0W6Tx7mLzYvTmEh7ZM6ym6t05MVVAkNBoK/gCjTBNlyanWQYGDWsmMjtbbOp9\nXJyGJK1vdyjhcW/9aTnU24NBSBDHiW+hjPGT3Ed94K5k4abGnKhVMVp/i8sDPT42\nKsqHGG5nAgMBAAECggEARuh8NyHLO22eeMlafwo5jaIrSGdE5nvuFBFDIKJkX1yA\nuhTom6FHdPdeVIkdYxtWRTj7Djb9U+5gUndXCvu1kmJDU3WBwZtqiHNiIyEb4pvL\nYzoaTffmPn0KWzJ0Hx0TY37tgUkTf2I9y0sg2HxC54fDZIPVBGaQ9bx3nGpfyuFt\nVSm/qkLbvSDuH/IWYsc20a3vWKnVV2jsKafziQpRl6VBre/D6jkzNZwRsInhLrcv\nAKgdNPvElbirzC0IL3sGn9lbYeZnaFFdwtlwbJDLTtKGv8urFqvlSayLboPXRKuq\nKSyLEWfgBu8vfUJ54UIHOBwffq56lsPvxamz+PnO/QKBgQDmf8wZDfZE1YDM2HjD\nE+lJMVWVGBj1xNGaOYFRnmdDsuBhh4Exme6v41JWCqbfP9ALBtcm5Lwzfx+WvzYS\nrI7ETEwItLYhGI7t7EHKe+1BstqIBa14SMxi9yZyU7je4S8+60AxZVUHGSTB6smi\nyospqKwQzVmr/Il7qoVIUOu0YwKBgQC3WBtaFrtJHkYY6sYXdRN1gzYNse+rvE0+\npFSvL1LWeiKWOXJ7MifnW3wVUI6/Qt6jq7ZvXsUYhg3QE3GfCkL0oe8UZX3kLDmm\nC3U2TQvP1By3Y/Gqd5/BGoCGU3yZhoxBEIYarlFBtGsJvemW7EldJvofLdCj8Qfw\nIM5gMH4zLQKBgQDICMJsP+SoKg1kOLzctyvufCUEhewrZcptKFilJ24An30AxuME\n080D0ajDyOy2tB9tYltXgowduMYGQhzAKgagLoKRz5p7sF9h9XXHLrNhH8Fs6Fh6\nGdteS5SPBT9cFVq2JN0JwSIATf7LV2HzqAkLdzkUP9IBYuFBdGPEtY1IdwKBgQCI\nZTh77dtIiwgU81uJCeT/ECz/RTeK6FwC1RfW9/rFajkezv/23JpJCIsoBDUd3m5p\nDo57DeLM2rWd7UkiyuyCt5F3+AUO4UPF3lJFok2+QAtY9zZK3hFwA/pHdAaG5Eyk\n/tj1Mmdq3QCgT7NePsxZS2zaEyhbPi3sm0tMzeakxQKBgAQ0c5DMSw/GJ/poLO8v\n5E5x+cbg6yA4Apr/9+BnKvbP5M3KBGJqYGC4v1elXIyht92jl/Ex1Pp5X41NgFwT\nDqiA77uIj+8W/HNKBqKTneLNuNOPKN3U4DXIysDttvkQUezu/F6yST+Ed4Y8AIJx\nCQUQJBV1/ebuIBIzcO3XztvZ\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_ID=1WWf-R0i5MuNw1WzhZUGpSSvZnb1zld6MQbw5ZArc53w
GOOGLE_SHEETS_RANGE=Responses!A:E

# ============================================
# Email Configuration (Gmail SMTP)
# ============================================
EMAIL_USER=swastikgupta.nexboy@gmail.com
EMAIL_APP_PASSWORD=govsftdmxemjoxqh

# ============================================
# Cache Configuration
# ============================================
CACHE_TTL=1800

# ============================================
# Rate Limiting (Optional)
# ============================================
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

---

## 🎵 Spotify Setup - IMPORTANT!

### Step 1: Add Redirect URI to Spotify Dashboard

1. Go to https://developer.spotify.com/dashboard
2. Click on your app: **portfolio-dashboard**
3. Click **"Edit Settings"**
4. Scroll to **"Redirect URIs"**
5. Add these TWO URIs:
   ```
   http://localhost:3000/api/spotify/callback
   https://shirokokun-portfolio-live.vercel.app/api/spotify/callback
   ```
6. Click **"SAVE"**

### Step 2: Get Spotify Refresh Token

**After adding variables to Vercel and redeploying:**

1. Visit: https://shirokokun-portfolio-live.vercel.app/api/spotify/auth
2. Copy the `authUrl` and visit it
3. Log in to Spotify and click "Agree"
4. You'll be redirected to a page with your tokens
5. Click **"📋 Copy"** button next to **Refresh Token**
6. Go back to Vercel → Environment Variables
7. Edit `SPOTIFY_REFRESH_TOKEN` and paste the token
8. Redeploy

---

## 📋 Quick Checklist

### Vercel (Frontend)
- [ ] Add all 12 environment variables
- [ ] Select all environments (Production, Preview, Development)
- [ ] Click "Save" for each variable
- [ ] Wait for `SPOTIFY_REFRESH_TOKEN` - get it after first deployment
- [ ] Redeploy after adding refresh token

### Railway (Backend)
- [ ] Set **Root Directory** to: `portfolio-backend`
- [ ] Add all 14 environment variables
- [ ] Click "Add" for each variable
- [ ] Redeploy

### Spotify Dashboard
- [ ] Add both redirect URIs
- [ ] Click "SAVE"
- [ ] Already have Client ID and Secret ✅

---

## 🧪 Testing After Deployment

### Test Backend (Railway)
```bash
# Health check
https://web-production-0e29e.up.railway.app/health

# Blog posts
https://web-production-0e29e.up.railway.app/api/blog/posts
```

### Test Frontend (Vercel)
```bash
# Homepage
https://shirokokun-portfolio-live.vercel.app/

# Spotify (after getting refresh token)
https://shirokokun-portfolio-live.vercel.app/api/spotify/now-playing

# YouTube
https://shirokokun-portfolio-live.vercel.app/ (check YouTube section)
```

---

## ⚠️ Important Notes

1. **NEVER commit** `.env` or `.env.local` files to git
2. **Google Sheets Private Key**: Keep the quotes and `\n` characters exactly as shown
3. **Spotify Refresh Token**: Get it AFTER first deployment
4. **Railway Root Directory**: Must be set to `portfolio-backend`
5. **CORS**: Frontend URL must match exactly (no trailing slash)

---

## 🎯 Order of Operations

1. ✅ Add all Vercel variables (except Spotify refresh token)
2. ✅ Deploy Vercel
3. ✅ Add all Railway variables
4. ✅ Set Railway Root Directory to `portfolio-backend`
5. ✅ Deploy Railway
6. ✅ Add Spotify redirect URIs to Spotify Dashboard
7. ✅ Get Spotify refresh token from Vercel URL
8. ✅ Add refresh token to Vercel
9. ✅ Redeploy Vercel
10. ✅ Test everything!

---

**All your credentials are organized and ready to deploy!** 🚀
