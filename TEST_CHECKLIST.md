# 🧪 LOCAL TESTING CHECKLIST

## ✅ Current System Tests (Before Building New Features)

### Backend Tests (http://localhost:8080)
- [ ] `GET /health` - Returns 200 OK
- [ ] `GET /api/blog/posts` - Returns 3 Substack posts
- [ ] `POST /api/contact` - Saves to Google Sheets

### Frontend Tests (http://localhost:3000)
- [ ] **Homepage** - Loads with Hero section
- [ ] **About Section** - Displays bio and skills
- [ ] **Projects Section** - Shows work gallery
- [ ] **Blog Page** (`/blog`) - Displays 3 posts from backend
- [ ] **Contact Page** (`/contact`) - Form submits successfully
- [ ] **Mobile Responsive** - Test on small screen

### Browser Console Checks
- [ ] No errors in console
- [ ] Blog API calls show correct backendUrl
- [ ] Images load properly
- [ ] Animations work smoothly

---

## 🚀 Phase 1: Foundation (Next to Build)

### Google Sheets Setup
- [ ] Add `mindscape_nodes` sheet with columns:
  - id, title, content, type, tags, isPublic, x, y, z, color, size, createdAt, updatedAt
- [ ] Add `mindscape_connections` sheet with columns:
  - id, sourceNodeId, targetNodeId, strength, type, label, createdAt
- [ ] Add `projects` sheet with columns:
  - id, name, description, tech, status, featured, thumbnail, liveUrl, nodeId
- [ ] Add `current_status` sheet with columns:
  - id, status, learningNow, workingOn, lastUpdated

### Backend: Admin Auth
- [ ] Install packages: `jsonwebtoken`, `bcrypt`
- [ ] Create `/admin/login` route
- [ ] Create JWT middleware for protected routes
- [ ] Test login with Postman/curl

### Backend: Email Integration
- [ ] Install `nodemailer`
- [ ] Setup Gmail app password
- [ ] Add email sending to contact route
- [ ] Test email delivery

---

## 🕸️ Phase 2: Mindscape System

### Backend: Mindscape API
- [ ] `GET /mindscape/public` - Return public nodes + connections
- [ ] `POST /admin/mindscape/node` - Create node (protected)
- [ ] `PATCH /admin/mindscape/node/:id` - Update node (protected)
- [ ] `DELETE /admin/mindscape/node/:id` - Delete node (protected)
- [ ] `POST /admin/mindscape/connection` - Create connection (protected)
- [ ] Test all routes with authentication

### Frontend: Public Mindscape Page
- [ ] Install `reactflow`
- [ ] Create `/mindscape` page
- [ ] Build `MindscapeGraph` component
- [ ] Fetch public nodes from backend
- [ ] Implement node click → details panel
- [ ] Add search/filter functionality

### Admin Panel: Initial Setup
- [ ] Create `admin-panel/` folder
- [ ] Initialize Next.js: `npx create-next-app@latest admin-panel`
- [ ] Install Tailwind + dependencies
- [ ] Create `/login` page
- [ ] Create `/dashboard` layout

### Admin Panel: Mindscape Editor
- [ ] Install `reactflow` in admin
- [ ] Build `MindscapeEditor` component
- [ ] Implement drag-to-create connections
- [ ] Add node CRUD operations
- [ ] Add public/private toggle
- [ ] Save changes to backend

---

## 🎨 Phase 3: Polish

### Glassmorphic Components
- [ ] `components/ui/GlassCard.tsx`
- [ ] `components/ui/GlassButton.tsx`
- [ ] `components/ui/GlassInput.tsx`
- [ ] `components/ui/GlassModal.tsx`
- [ ] Apply to all new UI elements

### Full Integration Testing
- [ ] Test entire flow: Login → Edit nodes → View on public site
- [ ] Test contact form → Email → Google Sheets
- [ ] Test blog RSS sync
- [ ] Test all animations
- [ ] Run Lighthouse audit
- [ ] Test on mobile devices

---

## 🚀 Final Deployment (When Everything Works)

### Pre-Push Checklist
- [ ] All tests passing
- [ ] No console errors
- [ ] All environment variables documented
- [ ] README updated
- [ ] Commit all changes

### Deploy Backend (Railway)
```bash
cd portfolio-backend
railway login
railway init
railway up
# Save URL: https://api.shirokokun.railway.app
```

### Deploy Admin Panel (Railway)
```bash
cd admin-panel
railway login
railway init
railway up
# Save URL: https://admin.shirokokun.railway.app
```

### Deploy Frontend (Vercel)
```bash
cd portfolio-website
vercel --prod
# Already live: https://shirokokun-portfolio-live.vercel.app
```

### Post-Deployment
- [ ] Update CORS in backend with frontend URLs
- [ ] Test production contact form
- [ ] Test production blog RSS
- [ ] Test admin login on Railway URL
- [ ] Share portfolio link! 🎉

---

## 📝 Notes

**Current Status:** Testing existing system on localhost
**Next Up:** Verify frontend works, then start Google Sheets setup
**Blockers:** None yet!

**Backend:** ✅ Running on http://localhost:8080
**Frontend:** ⏳ Running on http://localhost:3000 (needs manual check)

---

Last Updated: 2025-11-10
