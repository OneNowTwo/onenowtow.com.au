# Personal Agent

Independent personal agent for Michael Hegarty — work and life outside work. Built with **eve** + Next.js per [docs/Personal-Agent-Cursor-Brief.md](./docs/Personal-Agent-Cursor-Brief.md).

Not Muse. Customer-funded incentives. Pause is real. Short openers, deeper only when you ask.

## Requirements

- Node.js 24+
- npm
- Model credentials (`eve login` / AI Gateway)

## Quick start

```bash
cd personal-agent
cp .env.example .env.local
# set SESSION_SECRET, TOKEN_ENCRYPTION_KEY, PILOT_EMAIL
# add GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET for real sign-in
npm install
npm test
npm run dev       # http://localhost:3000
```

Sign in at `/login` with **Continue with Google**. Then **Connections → Connect Google**.

Pilot setup checklist: [docs/SETUP_FOR_MICHAEL.md](./docs/SETUP_FOR_MICHAEL.md).

Agent REPL (optional):

```bash
npm run dev:eve
```

## Layout

```text
agent/                 eve agent (instructions, tools, channel auth)
app/                   Next.js UI + API routes
src/domain/            delivery policy + feedback parsing
src/server/            PGlite/Postgres persistence, auth, store
src/connectors/        Google contracts + labelled fixtures
db/migrations/         SQL schema
tests/                 policy + feedback tests
docs/                  brief + progress ledger
```

## Done so far

- Google Sign-In (placeholder auth removed)
- Connect Google → Gmail + Calendar + ONT CRM sheet sync (encrypted tokens)
- Grounded candidates from real synced mail/CRM rows
- Persistent pause/memory/feedback; Sydney-gated sync schedules
- Chat UI ready for AI Gateway once credentials are linked

## Needs your accounts (then Cursor finishes deploy)

1. Private GitHub repo URL (ONT site stays separate)
2. Google OAuth client secrets
3. ONT CRM sheet URL/ID
4. Vercel + AI Gateway authorisation

See [docs/PROGRESS.md](./docs/PROGRESS.md) and [docs/SETUP_FOR_MICHAEL.md](./docs/SETUP_FOR_MICHAEL.md).

## Privacy principles (operational)

- No ads, paid ranking, or data sale
- Visible editable memory + tombstones
- Pause stops proactive jobs, not only notifications
- Fixtures are always labelled FIXTURE
