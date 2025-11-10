# 🚀 Deployment Checklist

## Pre-Deployment Tasks

### 1. **Clean Up Repository**
- [ ] Remove all `.env` and `.env.local` files from git history
- [ ] Update `.gitignore` to exclude sensitive files
- [ ] Remove unnecessary documentation files
- [ ] Remove development scripts (optional)

### 2. **Verify Environment Variables**
- [ ] Frontend `.env.example` created with all required variables
- [ ] Backend `.env.example` exists and is up to date
- [ ] All API credentials are ready

### 3. **Test Locally**
- [ ] Frontend runs on `localhost:3000` without errors
- [ ] Backend runs on `localhost:8080` without errors
- [ ] API integrations working (YouTube, Contact Form)
- [ ] No TypeScript errors
- [ ] No ESLint errors

---

## Deployment Steps

### **STEP 1: Prepare Repository**

```bash
# 1. Make sure you're on main/master branch
git checkout main

# 2. Create .env.example files (already done)
# Frontend: portfolio-website/.env.example
# Backend: portfolio-backend/.env.example

# 3. Remove sensitive files from staging
git rm --cached portfolio-website/.env.local
git rm --cached portfolio-backend/.env
git rm --cached .env

# 4. Update .gitignore (verify it includes)
# .env
# .env.local
# .env*.local

# 5. Commit changes
git add .
git commit -m "chore: prepare for deployment - remove sensitive files"
```

### **STEP 2: Deploy Backend First**

#### Option A: Deploy to Render.com
```bash
# 1. Create backend deployment branch
git checkout -b backend-deploy

# 2. Verify backend files
git add portfolio-backend/
git commit -m "deploy: backend to Render"
git push origin backend-deploy

# 3. On Render Dashboard:
# - New > Web Service
# - Connect your GitHub repo
# - Branch: backend-deploy
# - Root Directory: portfolio-backend
# - Build Command: npm install && npm run build
# - Start Command: npm start
# - Add environment variables from .env.example
```

#### Option B: Deploy to Railway.app
```bash
# Same branch as above
# On Railway:
# - New Project > Deploy from GitHub repo
# - Select backend-deploy branch
# - Root Directory: portfolio-backend
# - Add environment variables
```

**Environment Variables to Add on Backend:**
```
PORT=8080
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
SUBSTACK_RSS_URL=https://shirokokun.substack.com/feed
GOOGLE_SERVICE_ACCOUNT_EMAIL=<your-service-account>
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=<your-private-key>
GOOGLE_SHEETS_ID=<your-sheet-id>
GOOGLE_SHEETS_RANGE=Responses!A:E
CACHE_TTL=1800
```

**After Deployment:**
- [ ] Note down backend URL (e.g., `https://portfolio-backend.onrender.com`)
- [ ] Test endpoints:
  - `GET https://your-backend.com/api/blog`
  - `POST https://your-backend.com/api/contact` (with test data)

---

### **STEP 3: Deploy Frontend**

```bash
# 1. Switch back to main and create frontend branch
git checkout main
git checkout -b frontend-deploy

# 2. Verify frontend files
git add portfolio-website/
git commit -m "deploy: frontend to Vercel"
git push origin frontend-deploy

# 3. On Vercel Dashboard:
# - New Project > Import Git Repository
# - Select your repo
# - Framework Preset: Next.js
# - Root Directory: portfolio-website
# - Add environment variables
```

**Environment Variables to Add on Vercel:**
```
YOUTUBE_API_KEY=AIzaSyA-Jc03T8tNIEDOyIe4pqezJQ26FBGv-MY
YOUTUBE_CHANNEL_ID=UCobGcfjAgSJqgZaHFAuzkKg
SPOTIFY_CLIENT_ID=74fe9c8bf8d14a2996e07536ca733a6f
SPOTIFY_CLIENT_SECRET=679ad78855e148e2ae78090454e25c02
SPOTIFY_REFRESH_TOKEN=<to-be-obtained-after-oauth>
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
```

**After Deployment:**
- [ ] Note down frontend URL (e.g., `https://shirokokun-portfolio.vercel.app`)
- [ ] Test all pages load correctly
- [ ] Test YouTube integration
- [ ] Test contact form
- [ ] Test blog page

---

### **STEP 4: Update CORS and URLs**

```bash
# 1. Update Backend ALLOWED_ORIGINS
# On Render/Railway, update environment variable:
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000

# 2. Redeploy backend (usually auto-redeploys on env change)

# 3. Complete Spotify OAuth
# - Visit: https://your-frontend.vercel.app/api/spotify/auth
# - Authorize with Spotify
# - Copy refresh token from callback page
# - Add to Vercel environment variables: SPOTIFY_REFRESH_TOKEN
# - Redeploy frontend
```

---

### **STEP 5: Testing & Verification**

#### Frontend Tests:
- [ ] Homepage loads correctly
- [ ] MySpace page works (bento grid, timeline scrolls)
- [ ] YouTube videos display
- [ ] Spotify widget shows (if OAuth complete)
- [ ] Blog page loads posts from backend
- [ ] Contact form submits successfully
- [ ] Projects page works
- [ ] All animations work
- [ ] Mobile responsive

#### Backend Tests:
```bash
# Test blog endpoint
curl https://your-backend.com/api/blog

# Test contact endpoint
curl -X POST https://your-backend.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'
```

#### Integration Tests:
- [ ] Frontend can fetch from backend
- [ ] CORS works correctly
- [ ] No console errors
- [ ] API rate limiting works
- [ ] Error handling works

---

## Post-Deployment Tasks

### 1. **Domain Setup (Optional)**
- [ ] Add custom domain to Vercel
- [ ] Update DNS records
- [ ] Enable SSL (auto with Vercel)
- [ ] Update ALLOWED_ORIGINS in backend

### 2. **Monitoring Setup**
- [ ] Set up Vercel Analytics
- [ ] Monitor backend logs on Render
- [ ] Set up error tracking (Sentry optional)

### 3. **Documentation**
- [ ] Update README with live URLs
- [ ] Document API endpoints
- [ ] Add deployment notes

### 4. **Security**
- [ ] Verify all .env files are not in git
- [ ] Check API keys are not exposed in client code
- [ ] Verify rate limiting is active
- [ ] Test CORS restrictions

---

## Troubleshooting

### Common Issues:

#### 1. **CORS Errors**
```
Solution: Update ALLOWED_ORIGINS in backend .env
Verify: Frontend URL must match exactly (no trailing slash)
```

#### 2. **API Keys Not Working**
```
Solution: Re-add environment variables in deployment platform
Redeploy after adding variables
```

#### 3. **Build Fails**
```
Frontend: Check for TypeScript errors
Backend: Verify all dependencies are in package.json
```

#### 4. **404 on API Routes**
```
Frontend: Verify NEXT_PUBLIC_BACKEND_URL is correct
Backend: Check route paths match exactly
```

---

## Rollback Plan

If deployment fails:
```bash
# Frontend: Vercel auto-keeps previous deployments
# Can rollback from Vercel dashboard

# Backend: 
git checkout main
git push origin backend-deploy --force

# Or revert to specific commit:
git reset --hard <previous-commit-hash>
git push origin backend-deploy --force
```

---

## Branch Management

```
main (master)           # Stable production code
├── frontend-deploy     # Frontend deployment branch (Vercel)
├── backend-deploy      # Backend deployment branch (Render)
└── dev                 # Development branch (optional)
```

**Workflow:**
1. Develop on `main` or `dev` branch
2. Test locally
3. Merge to `frontend-deploy` and `backend-deploy` when ready
4. Platforms auto-deploy on push

---

## Useful Commands

```bash
# Check current branch
git branch

# See all branches
git branch -a

# Switch branches
git checkout <branch-name>

# Create and switch to new branch
git checkout -b <new-branch>

# Push branch to remote
git push origin <branch-name>

# Pull latest changes
git pull origin <branch-name>

# View commit history
git log --oneline

# Check git status
git status
```

---

## Contact & Support

- **GitHub Issues**: For deployment problems
- **Vercel Support**: For frontend issues
- **Render Support**: For backend issues

---

**Status**: Ready for deployment
**Last Updated**: November 10, 2025
