# Looksee

Video-first hostel discovery for backpackers.

## Local setup

```bash
cd looksee
npm install
cp .env.example .env.local
```

Fill `.env.local` using the checklist at the bottom of this README, then:

```bash
npm run dev
```

Open http://localhost:3000

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local Next.js server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (points/status/summary) |

## Supabase setup

1. Create a project at https://supabase.com/dashboard
2. Project Settings → API → copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server only)
3. Apply migrations (SQL editor or CLI):

```bash
# from looksee/
npx supabase db push
# or paste each file in supabase/migrations/ into the SQL editor in order
```

Order:

1. `001_initial_schema.sql`
2. `002_rls_policies.sql`
3. `003_video_upload_lifecycle.sql`
4. `004_mvp_points_aggregates.sql`
5. `005_rls_audit.sql`
6. `006_profile_oauth_metadata.sql`

4. Load destinations/hostels: either use the TypeScript seed fallback (browse works without DB rows) **or** insert real rows in Supabase Tables for production.

Authentication → URL Configuration:

- Site URL: `http://localhost:3000` (prod: your Vercel URL)
- Redirect URLs add:
  - `http://localhost:3000/auth/callback`
  - `https://YOUR_DOMAIN/auth/callback`

## Google OAuth setup

1. Supabase → Authentication → Providers → Google → Enable
2. Google Cloud Console → APIs & Services → Credentials → OAuth client ID (Web)
3. Authorized redirect URI must be the Supabase callback shown in the Google provider panel (looks like `https://YOUR_PROJECT.supabase.co/auth/v1/callback`)
4. Copy Client ID + Secret into Supabase Google provider fields
5. Test: open `/login` → Continue with Google

## Email magic link

1. Supabase → Authentication → Providers → Email → enable magic link
2. For local testing, check Auth → Users after requesting a link, or configure a custom SMTP provider
3. Test: `/login` → enter email → open link → lands on `/auth/callback` then `/profile`

## Mux setup

1. https://dashboard.mux.com → Settings → Access Tokens → Generate token with Mux Video access
2. Copy Token ID → `MUX_TOKEN_ID`
3. Copy Token Secret → `MUX_TOKEN_SECRET` (server only)
4. Settings → Webhooks → Create webhook
   - URL: `https://YOUR_PUBLIC_HOST/api/webhooks/mux`
   - Events: `video.upload.asset_created`, `video.asset.ready`, `video.asset.errored`
5. Copy signing secret → `MUX_WEBHOOK_SECRET`
6. Local webhooks need a tunnel (ngrok / Cloudflare Tunnel) pointing to your Next.js port
7. Set `NEXT_PUBLIC_APP_URL` to the same origin browsers use (important for Mux CORS)

## PostHog setup

1. https://app.posthog.com → Project Settings → Project API Key
2. `NEXT_PUBLIC_POSTHOG_KEY`
3. `NEXT_PUBLIC_POSTHOG_HOST` (usually `https://us.i.posthog.com`)

## Creating the first admin user

1. Sign up normally via `/login`
2. In Supabase → Table Editor → `profiles` → find your user
3. Set `role` from `traveller` to `admin`
4. Open `/admin` while signed in

## Testing video upload + moderation

1. Sign in
2. `/upload` → choose hostel → Bathroom → choose video (≤90s) → rate → submit
3. As admin → `/admin` → Pending videos → Approve
4. Uploader profile shows points + Approved
5. Hostel page shows the Mux video publicly
6. Second account can Helpful + Save

## Deploying to Vercel

1. Import the `looksee` folder / repo into Vercel
2. Add all env vars from `.env.example` (production values)
3. Set `NEXT_PUBLIC_APP_URL` to the Vercel URL
4. Update Supabase redirect URLs + Mux webhook URL to production
5. Deploy

## Architecture notes

- Guests browse freely; auth required for upload/save/helpful/rate/report/profile/admin
- User-generated data persists in Supabase when configured
- `.data/uploads.json` is only a fallback if Supabase env vars are missing
- Points use `points_transactions` + idempotent awards (`video_approved`, `first_upload_bonus`, `helpful_10`, `helpful_50`)
- Public queries only show `approved` videos

## Manual owner checklist

See the completion report in chat for the exact dashboard click-path checklist.
