# Sorted

**Dinner, sorted.**

A Manly, NSW prototype that helps a household answer one question: *what are we having for dinner tonight?* It is not a restaurant directory and not a delivery marketplace. The user gives a little context; the app returns **exactly three** dinner concepts from real local restaurants.

Restaurant names are real. Sorted Packs and indicative prices are prototype concepts for testing — they are not official restaurant offers.

## Stack

- Next.js 16.3.3 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (optional — the UI runs on local seed data without it)
- Deterministic recommendation engine (no LLM)

## Run locally

```bash
cd sorted
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The first path to try:

1. Homepage → **Sort tonight's dinner**
2. Household setup (The Taylors · Manly · 2095, or **Continue as guest**)
3. Tonight's mood
4. Three dinner recommendations
5. Save a favourite, choose a dinner, then view the restaurant

Other useful scripts:

```bash
npm test
npm run lint
npm run typecheck
```

## Guest mode vs Supabase

If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are unset, Sorted uses:

- Seeded Manly restaurants and prototype dinner packs from `src/lib/data/catalog.ts`
- Household, favourites, feedback and weekly plan in `localStorage`
- Analytics events logged to the console

The product is fully usable this way.

## Supabase (optional)

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=sorted-dev
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Then in the Supabase SQL editor or CLI:

1. Run `supabase/migrations/001_initial_schema.sql`
2. Run `supabase/migrations/002_manly_prototype_fields.sql`
3. Run `supabase/seed.sql`
4. Enable **Email magic link** auth
5. Add `http://localhost:3000/auth/callback` to Auth redirect URLs

Manual configuration still required in the Supabase dashboard:

- Auth → URL configuration (site URL + redirect allow list)
- Email templates / SMTP if you want magic links in production
- Service role key kept server-only (`SUPABASE_SERVICE_ROLE_KEY`)
- Confirm RLS is enabled after running the migration (it is, in SQL)

To regenerate seed SQL after catalog edits:

```bash
npx tsx scripts/export-seed.ts
```

## Admin

Utilitarian data entry lives at `/admin` and is not linked in consumer navigation.

Default password: `sorted-dev` (override with `ADMIN_PASSWORD`).

Admin distinguishes **Restaurant** records from **Prototype Sorted Packs**, including verified URLs, dinner suitability and concept-bundle flags.

Without Supabase, restaurant/pack edits apply to the running server's in-memory overlay and reset on restart.

## Product rules baked in

- Never more than three recommendations on screen
- Users see restaurant names, but do not browse a restaurant directory
- **None of these? Give me three more** replaces the current three
- No reviews, ratings, maps, driver tracking, promo codes or live ordering
- **I'd choose this** records selection intent; **View restaurant** opens a verified official URL only

## Recommendation engine

`src/lib/recommendation/engine.ts` scores packs on:

1. Postcode / suburb proximity
2. Feeds enough people
3. Budget fit
4. Dietary compatibility
5. Preferred cuisine
6. Mood tags
7. Avoided foods
8. Variety across the three results

Reasons are template-generated. The module is isolated so an AI model can be added later without rewriting the product.

## Analytics

`src/lib/analytics.ts` is a thin sink. Events currently log to the console. Register another sink (PostHog, etc.) with `registerAnalyticsSink()`.
