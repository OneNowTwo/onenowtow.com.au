# Progress ledger

Updated: 2026-10-14 (agent run)

## Milestone status

| Milestone | Status | Evidence |
| --- | --- | --- |
| 1 — Foundation and conversation | Implemented (local) | eve+Next scaffold; policy+feedback tests; PGlite schema; pilot cookie auth; chat UI shell; memory/controls/connections pages; pause/feedback persistence APIs; agent tools |
| 2 — Real work context | Not started | Google OAuth + CRM adapters stubbed; needs Michael's OAuth client + sheet access |
| 3 — Work and play discovery | Partial (fixtures) | Labelled FIXTURE candidates + policy selection tool; no live research yet |
| 4 — Proactive external delivery | Not started | Outbox table present; no web-push/SMS transport |
| 5 — Deployment and daily pilot | Not started | Deploy after OAuth + model credentials |

## Tests

```bash
cd personal-agent && npm test
```

17 tests passing (policy, feedback, persistent pause/idempotency).

Local smoke (2026-10-14):

- `POST /api/auth/login` → pilot session
- `GET /api/controls` → balanced defaults
- `POST /api/feedback` `"pause"` → `paused: true`, revision increments
- `/`, `/login`, `/memory` → HTTP 200
- `eve info` → status ready; tools: apply_feedback, pause/resume, memory, connections, fixture suggestion, web_search/fetch (no bash/write_file)

## Honest gaps

- Starter ZIP was not in the repo; policy module was recreated from the brief and tested.
- Chat model turns need AI Gateway / `eve login` credentials.
- Live Gmail/Calendar/CRM not connected until OAuth secrets exist for this deployment.
- Production should remove or tighten `placeholderAuth()` on the eve channel.
- Nested under `onenowtow.com.au` monorepo for now — prefer a private repo before any personal data flows.
