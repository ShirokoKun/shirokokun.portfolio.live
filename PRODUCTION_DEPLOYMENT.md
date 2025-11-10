# 🚀 DEPLOYMENT CONFIGURATION

## ✅ DEPLOYED SERVICES

### **Frontend (Vercel)**
- **URL:** https://shirokokun-portfolio-live.vercel.app
- **Preview URL:** https://shirokokun-portfolio-live-m2phsevkw-shirokokuns-projects.vercel.app
- **Repository:** ShirokoKun/shirokokun.portfolio.live
- **Root Directory:** `portfolio-website`

### **Backend (Railway)**
- **URL:** https://balanced-spontaneity-production-d232.up.railway.app
- **Repository:** ShirokoKun/shirokokun.portfolio.live
- **Root Directory:** `portfolio-backend`

---

## 🔧 REQUIRED CONFIGURATION

### **Vercel Environment Variables** ✅
```bash
# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL = portfolio-backend@totemic-atom-454000-r9.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\n...
GOOGLE_SHEETS_ID = 1WWf-R0i5MuNw1WzhZUGpSSvZnb1zld6MQbw5ZArc53w
GOOGLE_SHEETS_RANGE = Responses!A:E

# Email
EMAIL_USER = swastikgupta.nexboy@gmail.com
EMAIL_APP_PASSWORD = govsftdmxemjoxqh

# Backend API
NEXT_PUBLIC_API_URL = https://balanced-spontaneity-production-d232.up.railway.app

# Site URL
NEXT_PUBLIC_SITE_URL = https://shirokokun-portfolio-live.vercel.app
```

### **Railway Environment Variables** ⚠️ NEEDS UPDATE
```bash
# Server
NODE_ENV = production
PORT = 8080

# CORS - ⚠️ UPDATE THIS!
ALLOWED_ORIGINS = https://shirokokun-portfolio-live.vercel.app,https://shirokokun-portfolio-live-m2phsevkw-shirokokuns-projects.vercel.app

# OR use wildcard for all Vercel previews:
ALLOWED_ORIGINS = https://shirokokun-portfolio-live.vercel.app,https://*.vercel.app

# Substack
SUBSTACK_RSS_URL = https://shirokokun.substack.com/feed

# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL = portfolio-backend@totemic-atom-454000-r9.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\n...
GOOGLE_SHEETS_ID = 1WWf-R0i5MuNw1WzhZUGpSSvZnb1zld6MQbw5ZArc53w
GOOGLE_SHEETS_RANGE = Responses!A:E

# Email
EMAIL_USER = swastikgupta.nexboy@gmail.com
EMAIL_APP_PASSWORD = govsftdmxemjoxqh

# Cache
CACHE_TTL = 1800
```

---

## 🔄 IMMEDIATE ACTION ITEMS

1. **Update Railway CORS:**
   - Go to: https://railway.app → Your Project → Variables
   - Update `ALLOWED_ORIGINS` to include both URLs above
   - Railway will auto-redeploy

2. **Verify Vercel API URL:**
   - Go to: https://vercel.com → Project Settings → Environment Variables
   - Check `NEXT_PUBLIC_API_URL` = `https://balanced-spontaneity-production-d232.up.railway.app`
   - If wrong, update and redeploy

3. **Test After Updates:**
   - ✅ Contact form: https://shirokokun-portfolio-live.vercel.app/contact
   - ✅ Blog posts: https://shirokokun-portfolio-live.vercel.app/blog
   - ✅ Check email notifications

---

## 🎯 WHAT SHOULD WORK NOW

### **Contact Form** ✅
- Saves to Google Sheets ✅
- Sends email notifications ✅
- Works on production ✅

### **Blog** ⏳ (Will work after CORS fix)
- **Frontend API route created** (`/api/blog/posts`) - fetches directly from Substack
- **Backend API** (`https://balanced-spontaneity-production-d232.up.railway.app/api/blog/posts`) - also available
- **Fallback mechanism** - tries backend first, then frontend API

### **Backend API Endpoints**
- `GET /health` - Health check
- `GET /api/blog/posts` - Fetch blog posts from Substack
- `GET /api/blog/post/:slug` - Get individual post
- `POST /api/contact` - Submit contact form

---

## 🧪 TESTING CHECKLIST

After updating CORS in Railway:

- [ ] Go to https://shirokokun-portfolio-live.vercel.app
- [ ] Check homepage loads
- [ ] Navigate to /blog - Should see 3 posts
- [ ] Navigate to /contact - Submit test message
- [ ] Check Google Sheet - Message saved
- [ ] Check email - Notification received
- [ ] Test on mobile device
- [ ] Share your portfolio! 🎉

---

## 📊 CURRENT STATUS

| Feature | Status | Notes |
|---------|--------|-------|
| Frontend Deployment | ✅ Live | Vercel auto-deploys from main branch |
| Backend Deployment | ✅ Live | Railway auto-deploys from main branch |
| Contact Form → Sheets | ✅ Working | Saves successfully |
| Contact Form → Email | ✅ Working | Sends notifications |
| Blog Display | ⏳ Pending | Needs CORS fix OR will use frontend fallback |
| Email Notifications | ✅ Working | Verified in production |

---

## 🐛 TROUBLESHOOTING

### Blog Shows "HTTP 404"
**Cause:** Backend CORS not allowing frontend domain  
**Fix:** Update `ALLOWED_ORIGINS` in Railway to include Vercel URLs  
**Workaround:** Frontend now has `/api/blog/posts` fallback that works immediately

### Email Not Sending
**Cause:** EMAIL_USER or EMAIL_APP_PASSWORD missing in Vercel  
**Fix:** Add to Vercel environment variables and redeploy  
**Status:** ✅ Fixed - working now

### Contact Form Fails
**Cause:** Google Sheets credentials not set  
**Fix:** Verify all Google env vars in Vercel  
**Status:** ✅ Working

---

## 🚀 NEXT STEPS (After Blog Fix)

1. ✅ **Email notifications** - DONE
2. ⏳ **Blog display** - In progress (CORS update needed)
3. 📊 **Google Sheets structure** - Add mindscape tables
4. 🔐 **Admin authentication** - Build login system
5. 🕸️ **Mindscape visualization** - Build graph system
6. 👨‍💼 **Admin panel** - Separate admin dashboard

---

**Last Updated:** November 10, 2025  
**Deployment Status:** 🟡 Live (Blog needs CORS fix)
