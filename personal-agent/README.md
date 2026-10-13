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
# set SESSION_SECRET and PILOT_EMAIL
npm install
npm test
npm run db:seed   # labelled FIXTURE candidates only
npm run dev       # http://localhost:3000
```

Sign in at `/login` with `PILOT_EMAIL`. Chat at `/`. Memory, Connections and Controls are in the nav.

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

## Milestone 1 done locally

- Authenticated pilot session (cookie)
- Persistent controls (pause/resume/revision), preferences, facts
- Chat UI (eve web channel) + Memory / Connections / Controls / Today
- Deterministic feedback intents and delivery policy (tested)
- Connections show **disconnected** honestly until OAuth exists

## Next (needs your accounts)

1. Google Cloud OAuth client + redirect URI for this app
2. Selected ONT CRM sheet access
3. AI Gateway / model for live chat
4. Prefer a **private** GitHub repo before connecting real mail

See [docs/PROGRESS.md](./docs/PROGRESS.md).

## Privacy principles (operational)

- No ads, paid ranking, or data sale
- Visible editable memory + tombstones
- Pause stops proactive jobs, not only notifications
- Fixtures are always labelled FIXTURE
