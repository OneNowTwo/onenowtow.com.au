# One Now Two

Cinematic video production for commercial and industrial real estate. A minimalist, monochrome portfolio website showcasing high-end property video content with elegant, understated design language.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui components + Tailwind CSS
- **Routing**: Wouter
- **Backend**: Express + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Styling**: Monochrome design with Cormorant Garamond and Inter fonts

## Prerequisites

- Node.js 20+
- PostgreSQL database (recommend [Neon Database](https://neon.tech) for serverless)
- npm or yarn

## Local Development Setup

### 1. Clone and Install

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host/database
SESSION_SECRET=your-random-secret-here
```

### 3. Database Setup

#### Option A: Using Neon Database (Recommended)

1. Sign up at [Neon Database](https://neon.tech)
2. Create a new project
3. Copy the connection string to your `.env` file as `DATABASE_URL`

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database: `createdb onenowtwo`
3. Set `DATABASE_URL=postgresql://localhost/onenowtwo`

### 4. Run Database Migrations

```bash
npm run db:push
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
OneNowTwo/
├── client/                 # Frontend React application
│   ├── public/            # Static assets (videos, images)
│   └── src/
│       ├── components/    # UI components
│       ├── pages/         # Route pages
│       └── lib/           # Utilities
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Database interface
├── shared/               # Shared types and schemas
└── attached_assets/      # Additional media files
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## Pages

- `/` - Home page with hero video banner
- `/services` - Services overview
- `/portfolio` - Work portfolio
- `/about` - About the filmmaker
- `/enquire` - Contact/enquiry form
- `/thanks` - Thank you confirmation page

## Deployment to onenowtwo.com.au

### Build for Production

```bash
npm run build
```

This creates:
- `dist/public/` - Frontend build
- `dist/index.js` - Backend server bundle

### Deployment Options

#### Option 1: Traditional VPS (DigitalOcean, Linode, etc.)

1. Set up a VPS with Node.js installed
2. Clone your repository
3. Install dependencies: `npm install --production`
4. Build: `npm run build`
5. Set environment variables in production
6. Use PM2 or similar process manager:
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name onenowtwo
   ```
7. Set up Nginx as reverse proxy
8. Configure SSL with Let's Encrypt

#### Option 2: Platform as a Service

**Render.com** (Recommended):
1. Connect your GitHub repository
2. Add environment variables in dashboard
3. Build command: `npm run build`
4. Start command: `npm run start`
5. Add custom domain `onenowtwo.com.au`

**Railway.app**:
1. Connect repository
2. Configure environment variables
3. Railway auto-detects build/start commands
4. Add custom domain

**Fly.io**:
1. Install Fly CLI
2. Run `fly launch`
3. Configure `fly.toml`
4. Deploy with `fly deploy`
5. Add custom domain

### Environment Variables for Production

Ensure these are set in your production environment:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
SESSION_SECRET=<secure-random-string>
```

### Domain Configuration

Point your domain `onenowtwo.com.au` to your hosting provider:
- Update DNS A record to point to server IP
- Or add CNAME record if using platform like Render/Railway
- Enable SSL/HTTPS (usually automatic on modern platforms)

## Troubleshooting

### Video files not showing

Videos must be in `client/public/media/` directory to be served correctly in production. They'll be accessible at `/media/[filename]`.

### Database connection issues

- Verify `DATABASE_URL` is correct
- Ensure database allows connections from your server IP
- For Neon Database, ensure connection string includes `?sslmode=require`

### Port conflicts

If port 5000 is in use, change `PORT` in your `.env` file.

## License

MIT
