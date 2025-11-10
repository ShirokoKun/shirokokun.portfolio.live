# 🚀 Deployment URLs & Configuration

## 📋 Fill this out after deployment:

### Backend (Railway)
- **Railway URL**: `https://your-app.up.railway.app`
- **Health Check**: `https://your-app.up.railway.app/health`
- **API Test**: `https://your-app.up.railway.app/api/blog/posts`

### Frontend (Vercel)
- **Vercel URL**: `https://your-app.vercel.app`
- **Production URL**: (Add custom domain here if you have one)

---

## ⚙️ Environment Variables Checklist

### Railway (Backend)
- ✅ PORT=8080
- ✅ NODE_ENV=production
- ✅ GOOGLE_SERVICE_ACCOUNT_EMAIL
- ✅ GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
- ✅ GOOGLE_SHEETS_ID
- ✅ GOOGLE_SHEETS_RANGE=Sheet1!A:E
- ✅ SUBSTACK_RSS_URL
- ✅ CACHE_TTL=1800
- ⏳ ALLOWED_ORIGINS (Add Vercel URL after deployment)

### Vercel (Frontend)
- ⏳ NEXT_PUBLIC_API_URL (Add Railway URL)
- ✅ GOOGLE_SERVICE_ACCOUNT_EMAIL
- ✅ GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
- ✅ GOOGLE_SHEETS_ID
- ✅ GOOGLE_SHEETS_RANGE=Sheet1!A:E

---

## 🔄 Post-Deployment Steps

1. ✅ Deploy Backend to Railway
2. ✅ Copy Railway URL
3. ✅ Deploy Frontend to Vercel with Railway URL in `NEXT_PUBLIC_API_URL`
4. ✅ Copy Vercel URL
5. ⏳ Add Vercel URL to Railway's `ALLOWED_ORIGINS`
6. ⏳ Test both deployments
7. ⏳ Update Google Sheet sharing (give Editor access to service account)

---

## 🧪 Testing Commands

After deployment, test these endpoints:

```bash
# Backend Health Check
curl https://your-railway-url.up.railway.app/health

# Backend API - Get Blog Posts
curl https://your-railway-url.up.railway.app/api/blog/posts

# Frontend
# Open in browser: https://your-vercel-url.vercel.app
```

---

## 📝 Notes

- Railway Root Directory: `portfolio-backend`
- Vercel Root Directory: `portfolio-website`
- Framework: Next.js (auto-detected)
- Node Version: 18+ (auto-detected)
