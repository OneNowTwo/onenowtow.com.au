# Progress ledger

Updated: 2026-10-14 (pilot wiring run)

## Milestone status

| Milestone | Status | Evidence |
| --- | --- | --- |
| 1 — Foundation and conversation | Implemented | eve+Next; policy/feedback tests; PGlite; chat UI; memory/controls |
| 2 — Real work context | Implemented (awaiting credentials) | Google Sign-In + Connect Google OAuth; Gmail/Calendar/Sheets sync; CRM sheet reader; encrypted tokens; schedules; **placeholderAuth removed** |
| 3 — Work and play discovery | Partial | Live candidates from Gmail/CRM sync; play research still limited |
| 4 — Proactive external delivery | Not started | Schedules sync; no web-push/SMS yet |
| 5 — Deployment and daily pilot | Blocked on you | Private repo URL + Google OAuth secrets + Vercel/AI Gateway auth |

## Auth (fixed)

- Sign-in is **Continue with Google** (`/api/auth/google/*`).
- Eve channel: `appSession` → `vercelOidc` → `localDev` → production hard reject. **No `placeholderAuth()`.**
- `proxy.ts` redirects unauthenticated browsers to `/login`.
- Email login only on localhost when Google is not configured (or `ALLOW_DEV_EMAIL_LOGIN=1`).

## Tests

```bash
cd personal-agent && npm test
```

19 tests passing (policy, feedback, store, crypto/oauth state).

## Waiting on Michael

See [SETUP_FOR_MICHAEL.md](./SETUP_FOR_MICHAEL.md):

1. Private GitHub repo URL + Cursor App access
2. `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (+ session/encryption secrets)
3. ONT CRM sheet URL/ID
4. Vercel MCP + AI Gateway

Cursor cannot create the private repo with the current GitHub App token (no org/user create rights). The extract script is `scripts/push-private-repo.sh` once you paste the URL.
