# Quick Start Guide

Get One Now Two (commercial real estate video production site) running locally in 5 minutes.

## Prerequisites

- Node.js 20+
- npm

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env

# 3. (Optional) Add database URL to .env
# If you skip this, the app will use in-memory storage for testing
# DATABASE_URL=postgresql://user:password@host/database

# 4. Start development server
npm run dev
```

The app will be running at: **http://localhost:3000**

## What's Next?

1. **For Local Development**: The app is ready to use!
   - In-memory storage works for testing
   - Changes auto-reload with Vite HMR

2. **For Production Database**:
   - Sign up at [Neon Database](https://neon.tech) (free tier)
   - Create a project in Sydney region
   - Copy connection string to `.env`
   - Run: `npm run db:push`

3. **For Deployment**:
   - See [DEPLOYMENT.md](./DEPLOYMENT.md) for full guide
   - Recommended: Render.com (free tier available)
   - Your domain: onenowtwo.com.au

## Common Issues

**Port 3000 already in use?**
- Change `PORT=3000` to `PORT=3001` in `.env`
- Or kill the process: `lsof -ti:3000 | xargs kill -9`

**Videos not loading?**
- Ensure videos are in `client/public/media/` directory
- Videos will be served at `/media/[filename]`

**Database errors?**
- Leave `DATABASE_URL` empty for development
- App will use in-memory storage automatically

## Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run check      # TypeScript type checking
npm run db:push    # Push database schema changes
```

## Project Structure

```
OneNowTwo/
├── client/src/       # React frontend
│   ├── pages/       # Route pages (home, about, etc.)
│   └── components/  # UI components
├── server/          # Express backend
│   ├── index.ts    # Server entry
│   └── routes.ts   # API routes
└── shared/         # Shared types
```

## Pages

- `/` - Home with hero video
- `/services` - Services page
- `/portfolio` - Work portfolio
- `/about` - About page
- `/enquire` - Contact form
- `/thanks` - Thank you page

---

**Ready to deploy?** Check out [DEPLOYMENT.md](./DEPLOYMENT.md)
