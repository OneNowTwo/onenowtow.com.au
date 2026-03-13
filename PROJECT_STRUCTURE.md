# 📁 Project Structure Guide

## Overview

```
OneNowTwo/
├── 📚 DOCUMENTATION (Start Here!)
│   ├── START_HERE.md ⭐              # Main entry point - READ THIS FIRST
│   ├── SUMMARY.md                    # Executive summary
│   ├── DEPLOY_NOW.md                 # Fast 30-min deployment
│   ├── RENDER_DEPLOYMENT_CHECKLIST.md  # Detailed Render guide
│   ├── DEPLOYMENT.md                 # Multi-platform deployment
│   ├── PRODUCTION_CHECKLIST.md       # Pre-flight checklist
│   ├── QUICKSTART.md                 # Local dev guide
│   ├── WHATS_NEW.md                  # What changed from Replit
│   ├── PROJECT_STRUCTURE.md          # This file
│   └── README.md                     # Project overview
│
├── ⚙️ CONFIGURATION
│   ├── .env                          # Local environment (DO NOT COMMIT)
│   ├── .env.example                  # Template for team
│   ├── .env.production.example       # Production template
│   ├── .gitignore                    # Git exclusions
│   ├── package.json                  # Dependencies & scripts
│   ├── tsconfig.json                 # TypeScript config
│   ├── vite.config.ts                # Vite bundler config
│   ├── tailwind.config.ts            # Tailwind CSS config
│   ├── postcss.config.js             # PostCSS config
│   └── components.json               # shadcn/ui config
│
├── 🚀 DEPLOYMENT CONFIGS
│   ├── render.yaml                   # Render.com (recommended)
│   ├── Dockerfile                    # Docker deployment
│   ├── .dockerignore                 # Docker exclusions
│   ├── fly.toml                      # Fly.io (Sydney region)
│   ├── railway.json                  # Railway.app
│   ├── vercel.json                   # Vercel
│   ├── .nvmrc                        # Node version (20)
│   ├── .node-version                 # Node version backup
│   └── .github/workflows/deploy.yml  # GitHub Actions
│
├── 🗄️ DATABASE
│   ├── drizzle.config.ts             # Drizzle ORM config
│   └── shared/schema.ts              # Database schema
│
├── 🎨 FRONTEND (client/)
│   ├── public/                       # Static assets
│   │   ├── media/                    # Videos & images
│   │   │   └── hero/                 # Hero banner videos
│   │   │       ├── One Now Two Banner Video Property Portfolio.mp4
│   │   │       ├── hero-1080.mp4
│   │   │       ├── hero-web.mp4
│   │   │       └── hero-poster.jpg
│   │   └── videos/                   # Additional videos
│   ├── src/
│   │   ├── pages/                    # Route components
│   │   │   ├── home.tsx ⭐           # Homepage with hero
│   │   │   ├── services.tsx          # Service packages
│   │   │   ├── portfolio.tsx         # Work showcase
│   │   │   ├── about.tsx             # Company info
│   │   │   ├── enquire.tsx           # Contact form
│   │   │   ├── thanks.tsx            # Confirmation
│   │   │   └── not-found.tsx         # 404 page
│   │   ├── components/               # UI components
│   │   │   └── ui/                   # shadcn/ui components
│   │   ├── hooks/                    # React hooks
│   │   ├── lib/                      # Utilities
│   │   ├── assets/                   # Images & logos
│   │   ├── App.tsx                   # Main app component
│   │   ├── main.tsx                  # React entry point
│   │   └── index.css                 # Global styles
│   ├── index.html                    # HTML template
│   └── site.webmanifest              # PWA manifest
│
├── 🔧 BACKEND (server/)
│   ├── index.ts ⭐                   # Server entry point
│   ├── routes.ts                     # API routes
│   ├── storage.ts                    # Database interface
│   └── vite.ts                       # Vite integration
│
├── 📦 SHARED (shared/)
│   └── schema.ts                     # Shared types & DB schema
│
└── 📎 ASSETS (attached_assets/)
    └── [Client logos & reference files]
```

---

## 🎯 Key Files Explained

### 📚 Documentation (Must Read)

**START_HERE.md** ⭐
- Your main entry point
- Overview of everything
- Next steps clearly outlined
- Read this first!

**DEPLOY_NOW.md**
- Fast deployment path (30 min)
- Step-by-step Render deployment
- Perfect if you want to go live quickly

**RENDER_DEPLOYMENT_CHECKLIST.md**
- Complete Render guide with checkboxes
- Troubleshooting included
- Best for thorough setup

**PRODUCTION_CHECKLIST.md**
- Pre-flight verification
- Post-deployment testing
- Quality assurance

### ⚙️ Configuration Files

**.env**
- Local environment variables
- Port, database URL, secrets
- ❌ Never commit this file

**package.json**
- Project dependencies
- Build & dev scripts
- Project metadata

**vite.config.ts**
- Frontend build configuration
- Path aliases (@, @shared, @assets)
- React plugin setup

**tsconfig.json**
- TypeScript compiler settings
- Type checking rules
- Module resolution

### 🚀 Deployment Files

**render.yaml** (Recommended)
- Render.com auto-deployment
- Free tier configured
- Singapore region (closest to Australia)

**Dockerfile**
- Container deployment option
- Multi-stage build for optimization
- Works with any Docker host

**fly.toml**
- Fly.io deployment
- Sydney region configured
- Good for Australia-focused apps

### 🎨 Frontend Structure

**client/public/**
- Static files served at site root
- Videos in `/media/` accessible at `/media/[file]`
- No bundling/processing

**client/src/pages/**
- Each page is a route component
- `home.tsx` is your main landing page
- All use Wouter for routing

**client/src/components/ui/**
- shadcn/ui components
- Radix UI primitives
- Fully customizable

### 🔧 Backend Structure

**server/index.ts**
- Express server setup
- Middleware configuration
- Port binding (3000 in dev, 5000 in prod)

**server/routes.ts**
- API endpoint definitions
- Currently minimal (ready to extend)

**server/storage.ts**
- Database abstraction layer
- In-memory fallback for dev
- PostgreSQL for production

---

## 📋 What's Where

### Want to...

**Change the homepage?**
→ `client/src/pages/home.tsx`

**Update services/packages?**
→ `client/src/pages/services.tsx`

**Add portfolio items?**
→ `client/src/pages/portfolio.tsx`

**Modify company info?**
→ `client/src/pages/about.tsx`

**Customize contact form?**
→ `client/src/pages/enquire.tsx`

**Change colors/styling?**
→ `client/src/index.css` (CSS variables)
→ `tailwind.config.ts` (Tailwind theme)

**Add API endpoints?**
→ `server/routes.ts`

**Modify database schema?**
→ `shared/schema.ts`

**Change environment variables?**
→ `.env` (local)
→ Render dashboard (production)

**Update hero video?**
→ Replace files in `client/public/media/hero/`
→ Update reference in `client/src/pages/home.tsx`

---

## 🎬 Media Assets Location

### Hero Videos
```
client/public/media/hero/
├── One Now Two Banner Video Property Portfolio.mp4 ⭐ (Main)
├── hero-1080.mp4
├── hero-web.mp4
├── hero-web.webm
└── hero-poster.jpg
```

**Referenced in**: `client/src/pages/home.tsx` line 46, 66

### Client Logos
```
attached_assets/
├── JLL-Logo-Positive-10-29mm-RGB-1-002_*.png
├── png-clipart-cbre-group-real-estate-*.png
├── Rydges_Hotels_&_Resorts_Logo_*.png
├── Arissa_*.png
└── sponslogos4_*.png (Ashe Morgan)
```

**Referenced in**: `client/src/pages/home.tsx` lines 4-8

### Portfolio Videos
- Hosted on Vimeo
- Embedded via iframes
- IDs configured in `home.tsx` and `portfolio.tsx`

---

## 🔄 Development Workflow

### 1. Local Development
```bash
npm run dev          # Start dev server
# Edit files in client/src/ or server/
# Changes auto-reload
```

### 2. Type Checking
```bash
npm run check        # Verify TypeScript
```

### 3. Build for Production
```bash
npm run build        # Create dist/ folder
```

### 4. Test Production Build
```bash
npm run preview      # Test production locally
```

### 5. Deploy
```bash
git add .
git commit -m "Update"
git push origin main
# Render auto-deploys
```

---

## 📦 Output Structure (After Build)

```
dist/
├── public/              # Frontend (Vite output)
│   ├── index.html
│   ├── assets/          # Bundled JS/CSS
│   └── media/           # Static videos/images
└── index.js             # Backend (esbuild output)
```

**Production server serves**:
- Backend API at `/api/*`
- Static frontend at `/*`
- All from single Express server on port 5000

---

## 🎯 Critical Paths

### Most Important Files
1. `START_HERE.md` - Your navigation hub
2. `client/src/pages/home.tsx` - Your homepage
3. `server/index.ts` - Your backend
4. `package.json` - Dependencies & scripts
5. `.env` - Local configuration

### For Deployment
1. `render.yaml` - Render configuration
2. `.env.production.example` - Production variables template
3. `DEPLOY_NOW.md` - Deployment instructions

### For Development
1. `package.json` scripts
2. `vite.config.ts` - Build config
3. `tsconfig.json` - TypeScript config

---

## 📊 File Count Summary

- **Documentation**: 10 files
- **Configuration**: 12 files
- **Deployment Configs**: 9 files
- **Frontend Pages**: 7 files
- **UI Components**: 50+ files (shadcn/ui)
- **Backend Files**: 4 files
- **Database Schema**: 1 file

**Total Project Files**: 500+ (including dependencies)
**Your Code Files**: ~70
**Documentation Files**: 10

---

## 🚀 Quick Navigation

### I want to...

**Get started** → `START_HERE.md`
**Deploy quickly** → `DEPLOY_NOW.md`
**Deploy carefully** → `RENDER_DEPLOYMENT_CHECKLIST.md`
**Understand everything** → `SUMMARY.md`
**See what changed** → `WHATS_NEW.md`
**Check readiness** → `PRODUCTION_CHECKLIST.md`
**Learn the tech** → `README.md`
**Deploy elsewhere** → `DEPLOYMENT.md`

---

## ✅ Current Status

```
📁 OneNowTwo/
   ├── 🟢 Local development running (port 3000)
   ├── 🟢 All dependencies installed
   ├── 🟢 TypeScript compiling
   ├── 🟢 Build tested
   ├── 🟢 Environment configured
   ├── 🟢 Documentation complete
   ├── 🟡 GitHub remote (needs public repo)
   ├── 🔴 Production database (needs setup)
   ├── 🔴 Render deployment (ready to deploy)
   └── 🔴 Custom domain (ready to configure)
```

**Legend**: 🟢 Done | 🟡 Partial | 🔴 To Do

---

## 🎬 Next Steps

1. **Read**: `START_HERE.md` (5 min)
2. **Choose**: Deployment path (`DEPLOY_NOW.md` or `RENDER_DEPLOYMENT_CHECKLIST.md`)
3. **Deploy**: Follow chosen guide (30-60 min)
4. **Launch**: Configure onenowtwo.com.au (1-48 hours DNS)

---

**You are here**: Local development ✅  
**Next stop**: Production deployment 🚀  
**Final destination**: onenowtwo.com.au live! 🎉
