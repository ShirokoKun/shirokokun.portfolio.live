# 🎯 Deployment Action Plan

## Current Status: ✅ Ready for Deployment

### ✅ **Completed**
1. ✅ Architecture documented (`ARCHITECTURE.md`)
2. ✅ Deployment checklist created (`DEPLOYMENT_CHECKLIST.md`)
3. ✅ Comprehensive README created
4. ✅ `.gitignore` updated to exclude sensitive files
5. ✅ Frontend `.env.example` created
6. ✅ Backend `.env.example` exists
7. ✅ Deployment scripts created (`.ps1` and `.sh`)
8. ✅ All UI fixes completed (MySpace bento grid, Timeline scroll, Spotify/YouTube alignment)

---

## 🚀 Next Steps (Execute in Order)

### **STEP 1: Clean Repository (5 minutes)**

Run preparation script:
```powershell
cd d:\PORTFOLIO
.\prepare-deployment.ps1
```

Or manually:
```bash
# Remove sensitive files from git
git rm --cached portfolio-website/.env.local
git rm --cached portfolio-backend/.env
git rm --cached .env

# Verify .gitignore includes:
# .env
# .env.local
# .env*.local

# Commit changes
git add .
git commit -m "chore: prepare for deployment - remove sensitive files, add documentation"
git push origin main
```

---

### **STEP 2: Get Google Sheets Credentials (15 minutes)**

**For Contact Form Backend:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "Portfolio Contact Form"
3. Enable Google Sheets API
4. Create Service Account:
   - IAM & Admin > Service Accounts > Create
   - Name: "portfolio-backend"
   - Grant role: "Editor"
   - Create key (JSON format)
5. Copy credentials:
   - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
6. Create Google Sheet for responses
7. Share sheet with service account email (Editor access)
8. Copy Sheet ID from URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
9. Set range: `Responses!A:E`

**Save these for deployment!**

---

### **STEP 3: Deploy Backend First (20 minutes)**

#### A. Create Backend Branch
```bash
git checkout -b backend-deploy
git push origin backend-deploy
```

#### B. Deploy on Render.com

1. **Sign up**: [render.com](https://render.com/)
2. **New Web Service**:
   - Connect GitHub account
   - Select repository: `shirokokun.portfolio.live`
   - Branch: `backend-deploy`
   - Root Directory: `portfolio-backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Add Environment Variables**:
```env
PORT=8080
NODE_ENV=production
ALLOWED_ORIGINS=http://localhost:3000
SUBSTACK_RSS_URL=https://shirokokun.substack.com/feed
GOOGLE_SERVICE_ACCOUNT_EMAIL=<from-step-2>
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=<from-step-2>
GOOGLE_SHEETS_ID=<from-step-2>
GOOGLE_SHEETS_RANGE=Responses!A:E
CACHE_TTL=1800
```

4. **Deploy** → Wait for build to complete

5. **Note Backend URL**: `https://portfolio-backend-xxxx.onrender.com`

6. **Test Endpoints**:
```bash
# Test blog API
curl https://your-backend.onrender.com/api/blog

# Test contact API (should return success)
curl -X POST https://your-backend.onrender.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test"}'
```

---

### **STEP 4: Deploy Frontend (20 minutes)**

#### A. Create Frontend Branch
```bash
git checkout main
git checkout -b frontend-deploy
git push origin frontend-deploy
```

#### B. Deploy on Vercel

1. **Sign up**: [vercel.com](https://vercel.com/)
2. **New Project**:
   - Import Git Repository
   - Select: `shirokokun.portfolio.live`
   - Framework Preset: `Next.js`
   - Root Directory: `portfolio-website`

3. **Add Environment Variables**:
```env
YOUTUBE_API_KEY=AIzaSyA-Jc03T8tNIEDOyIe4pqezJQ26FBGv-MY
YOUTUBE_CHANNEL_ID=UCobGcfjAgSJqgZaHFAuzkKg
SPOTIFY_CLIENT_ID=74fe9c8bf8d14a2996e07536ca733a6f
SPOTIFY_CLIENT_SECRET=679ad78855e148e2ae78090454e25c02
SPOTIFY_REFRESH_TOKEN=
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
```

4. **Deploy** → Wait for build

5. **Note Frontend URL**: `https://shirokokun-portfolio.vercel.app`

---

### **STEP 5: Update CORS (5 minutes)**

Go back to Render dashboard:
1. Open your backend service
2. Environment > Edit
3. Update `ALLOWED_ORIGINS`:
```env
ALLOWED_ORIGINS=https://shirokokun-portfolio.vercel.app,http://localhost:3000
```
4. Save → Backend will auto-redeploy

---

### **STEP 6: Complete Spotify OAuth (10 minutes)**

1. Visit: `https://shirokokun-portfolio.vercel.app/api/spotify/auth`
2. Click authorization link
3. Login to Spotify
4. Authorize application
5. Copy `refresh_token` from callback page
6. Go to Vercel dashboard
7. Environment Variables > Edit
8. Add: `SPOTIFY_REFRESH_TOKEN=<copied-token>`
9. Redeploy frontend

---

### **STEP 7: Test Everything (15 minutes)**

#### Frontend Tests:
- [ ] Homepage loads correctly
- [ ] MySpace page:
  - [ ] Bento grid displays (Ideas + Instagram)
  - [ ] Timeline scrolls horizontally
  - [ ] YouTube videos display
  - [ ] Spotify widget shows current track
- [ ] Blog page shows posts
- [ ] Contact form works (check Google Sheet)
- [ ] Projects page loads
- [ ] Mobile responsive

#### Backend Tests:
```bash
# Blog endpoint
curl https://your-backend.onrender.com/api/blog | jq

# Contact endpoint
curl -X POST https://your-backend.onrender.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

#### Integration Tests:
- [ ] Frontend can fetch from backend (no CORS errors)
- [ ] Contact form submission appears in Google Sheet
- [ ] Blog posts load from Substack
- [ ] YouTube videos display with real data
- [ ] Spotify shows current playing (if authenticated)

---

## 📋 Credentials Checklist

Make sure you have these ready:

### ✅ **YouTube API**
- [x] API Key: `AIzaSyA-Jc03T8tNIEDOyIe4pqezJQ26FBGv-MY`
- [x] Channel ID: `UCobGcfjAgSJqgZaHFAuzkKg`

### ✅ **Spotify API**
- [x] Client ID: `74fe9c8bf8d14a2996e07536ca733a6f`
- [x] Client Secret: `679ad78855e148e2ae78090454e25c02`
- [ ] Refresh Token: (To be obtained after deployment)

### ⏳ **Google Sheets API**
- [ ] Service Account Email
- [ ] Private Key
- [ ] Sheet ID
- [ ] Sheet Range: `Responses!A:E`

### ✅ **Substack**
- [x] RSS URL: `https://shirokokun.substack.com/feed`

---

## 🎉 Post-Deployment

After successful deployment:

1. **Update Repository**:
   - Update README with live URLs
   - Add deployment badges
   - Document any issues encountered

2. **Monitor**:
   - Check Vercel Analytics
   - Monitor Render logs
   - Test all features regularly

3. **Optional**:
   - Add custom domain
   - Set up error tracking (Sentry)
   - Enable analytics

---

## 🚨 Troubleshooting

### Issue: CORS Errors
```
Solution: 
1. Check ALLOWED_ORIGINS in backend
2. Ensure no trailing slashes in URLs
3. Redeploy backend after changes
```

### Issue: API Keys Not Working
```
Solution:
1. Verify environment variables are set correctly
2. Check for extra spaces or quotes
3. Redeploy after adding/updating variables
```

### Issue: Build Fails
```
Frontend: Check TypeScript errors, missing dependencies
Backend: Verify all env vars are set, check build logs
```

### Issue: Can't Access Backend
```
Solution:
1. Check backend is deployed and running
2. Test endpoint directly in browser
3. Check Render service logs
```

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Express Docs**: https://expressjs.com/

---

## ⏱️ Time Estimate

| Task | Duration |
|------|----------|
| Clean repository | 5 min |
| Get Google Sheets credentials | 15 min |
| Deploy backend | 20 min |
| Deploy frontend | 20 min |
| Update CORS | 5 min |
| Complete Spotify OAuth | 10 min |
| Test everything | 15 min |
| **Total** | **~90 minutes** |

---

## ✅ Final Checklist

Before marking as complete:

- [ ] Both branches (`backend-deploy`, `frontend-deploy`) pushed to GitHub
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] All environment variables configured
- [ ] CORS working correctly
- [ ] Contact form tested (check Google Sheet)
- [ ] Blog posts loading
- [ ] YouTube videos displaying
- [ ] Spotify widget working (if OAuth complete)
- [ ] No console errors in browser
- [ ] Mobile responsive tested
- [ ] README updated with live URLs

---

**Ready to Deploy!** 🚀

Start with STEP 1 and follow sequentially. Each step builds on the previous one.

Good luck! 🎉
