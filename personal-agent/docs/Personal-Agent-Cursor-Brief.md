# Personal Agent — Full Cursor Build Brief

Prepared for Michael Hegarty • 14 October 2026 • Version 1

## 1. Start here: the instruction to Cursor

Build a working, private personal agent for Michael Hegarty that understands both his work and his life outside work. It connects to his real information, learns what matters to him, finds relevant things proactively, and starts short, natural conversations at useful moments. It should feel like a perceptive mate who is paying attention: useful, relaxed, direct, occasionally encouraging, and comfortable staying quiet.

This is not just a productivity planner, motivational chatbot, shutdown reminder, or recommendation feed. Work and play are equally central. The goal is useful assistance across a whole life, delivered with good judgement.

Read this entire brief before coding. Inspect the current repository before selecting implementation details. Preserve existing working code. The accompanying starter contains a small tested decision-policy module, not a completed application. Use it as a behavioural reference and integrate it with persistent storage and the agent runtime. Do not pretend its in-memory gate is production infrastructure.

Implement one real end-to-end vertical slice early: Michael connects a real source, a source update becomes a grounded suggestion, the agent opens a conversation, Michael responds, and the reply changes persistent behaviour. Continue through the milestones below. Do not stop after a polished dashboard or a plan.

Use fixture mode for development, clearly labelled. Never show seeded email, events, offers, account connections or messages as live. Do not publish Michael's data or source code in a public repository. GitHub is the code source of truth; use a private repository. Do not assume this brief authorises sending messages to clients or changing external records.

## 2. Product thesis and commercial principles

The customer wants an independent agent built around their interests, rather than a platform whose business depends on advertising, attention or paid placement. Implement that principle directly: customer-funded subscriptions later; no ads, paid recommendation ranking, data sales or engagement-maximisation loops. Independence concerns the product's incentives and control; external infrastructure and model providers can still be used transparently.

Start with Michael as the only pilot user. Design all data around user identity so a second user can be added safely, but do not build team billing, enterprise dashboards or a marketplace in the pilot. Product name is undecided. Use “Personal Agent” internally, with a configurable display name. Do not anchor branding to “Knock Off”: the product is broader than stopping work.

Success means Michael repeatedly receives something worth acting on, feels understood, and trusts the controls. Long conversations and high notification counts are not success metrics.

## 3. Michael's starting context

Use the following as onboarding context, not live operational truth:

- Michael runs One Now Two, a Sydney video/content production business with commercial property work.
- His existing BDM process already draws on emails, LinkedIn activity, CRM, financial information and notes. Preserve and learn from it; do not rebuild or independently contradict it.
- He prefers short, casual, specific language. Avoid corporate coaching language, generic affirmations, repeated long titles and over-explaining.
- He is exploring business ideas and builds software with Cursor. Research and practical opportunities can be useful work-related discoveries.
- His timezone is Australia/Sydney. Follow IANA timezone rules and daylight saving, not a hardcoded UTC offset.
- Bushwalks, movies, training and local food offers are expressed examples of possible interests. Ask naturally which ones actually fit him, and learn specifics over time. Do not infer alcohol preferences, fitness, exact residence, regular routines or availability from these examples.

Do not seed historic job values, project statuses, family details or old deadlines as current facts. Fresh connected records determine operational truth. The app does not automatically inherit ChatGPT's account access, memory or connected sessions: implement its own authorisation and an explicit context import.

## 4. The conversation is the product

### 4.1 Lead with one concrete thing

Most proactive messages should be one or two sentences, usually around 15–45 words. Include enough substance for Michael to decide whether he cares. Invite a reply instead of dumping a report. Do not turn every notification into a vague teaser.

Hypothetical example only; verify any actual offer before use:

> Just saw there's a two-for-one schnitty night at the Paddo tomorrow. Keen to hear more?

If Michael says yes, give the date, venue, conditions, relevant timing and source link. If the source does not establish a booking requirement, do not invent one. Offer a calendar reminder if appropriate; do not silently reserve or pay.

Work example, only when grounded in actual source evidence:

> Found a breakdown of how another agency prices monthly content. Looks relevant to the retainer idea. Want a look?

Then explain the useful part and why it relates to his project. Do not merely paste a long article summary.

Encouragement example, only if progress is supported:

> That edit's out and the quote's sent. Pretty solid day. Fancy finding something to do tonight?

### 4.2 Avoid these patterns

- “As your AI productivity companion…”
- “You deserve to prioritise your wellness journey.”
- “I found something amazing. Click to discover what!”
- Long unsolicited lists, constant status summaries, fake familiarity or forced Australian slang.
- Claiming to see what Michael is doing when the only signal is a calendar entry.
- Saying an email was read, a task completed, or a workout attended without evidence.
- Repeating a suggestion through another channel because it was ignored.
- Asking “Want to know more?” after every message. Vary the invitation naturally.
- Claiming human feelings, personal outings or a human identity. Be personable without pretending to be a person.

### 4.3 Conversation depth

Use progressive disclosure: opener → relevant details → practical next step. This is a style, not a forced three-click workflow. If Michael asks directly for all the details, provide them. Resolve “yes”, “that one”, “Friday” and “not there” against the correct referenced suggestion. If multiple recent suggestions make the reference ambiguous, ask a short clarifying question.

Keep a canonical suggestion ID and link it to messages in every channel. Never interpret a stale “yes” as permission for an unrelated action. Attach source evidence to the details even when the opener has no citation clutter. Urgent information must state the consequence and deadline upfront; do not hide it behind a teaser.

### 4.4 Feedback is ordinary conversation

| User says | Required effect | Example acknowledgement |
|---|---|---|
| Less of this | Reduce the identified category/frequency; do not globally silence the agent | “Yep, fewer food deals.” |
| Good find | Modestly strengthen matching preferences; never increase volume automatically | “Nice, I'll keep an eye out for similar things.” |
| Not this week | Snooze that item or theme for the relevant period; not permanent dislike | “No worries, I'll leave it for now.” |
| Not my thing | Suppress this item; ask or infer carefully whether the category is unwanted | “Got it. Is it that venue, or pub deals generally?” |
| Remind me Friday | Create a persisted reminder in Sydney time, confirming the actual date/time | “Friday at 9am—done.” |
| I'm flat today | Temporarily soften tone and reduce demands; offer help/rest without diagnosis | “Fair enough. Want a low-effort option, or some quiet?” |
| Leave me alone until Monday | Pause all agent-initiated activity until the confirmed local time | “Done. Quiet until Monday at 9am.” |
| Stop / pause | Pause immediately, indefinitely if no end time is given | “Paused. I'll wait until you tell me otherwise.” |
| Resume | Resume without flooding the user with missed suggestions | “Back on. I'll keep it relevant.” |

Default reminder time may be 9am only if shown and editable in onboarding. Convert relative dates using the message timestamp in the user's timezone; store the resolved instant and original phrase. If “Friday” could materially mean today or next Friday, clarify. A temporary state such as feeling flat must expire (default end of local day) and must not become a permanent personality label.

Intent parsing produces a typed, validated command. Low-confidence preference interpretation asks one short question. Explicit stop commands have a fast deterministic path before any LLM call. Record changes with provenance and an undo option. Silence is neutral, not negative feedback.

## 5. Main user journeys

### A. First session

1. Sign in as Michael through a real authenticated account.
2. Explain briefly: “I'll get to know your work and what you like doing outside it, then bring you things worth your time.”
3. Connect Google mail/calendar and the existing CRM, then add other sources. Explain requested access in plain language; connection steps are real OAuth or supported provider auth.
4. Ask a few conversational questions: what he wants help with, what makes a good after-hours suggestion, preferred areas/travel time, typical budget, when interruptions are welcome.
5. Show a compact editable “What I know so far” summary. No 30-question survey before the app works.
6. Let the user choose activity level: Quiet, Balanced or Proactive. Proposed Balanced starting ceiling: three agent-initiated messages/day, two-hour spacing and quiet hours 9pm–8am. These are adjustable pilot defaults, not quotas or permanent limits.
7. Surface the first useful finding as soon as enough real context exists. Continue learning gradually.

### B. Work signal

New email → sync thread changes → extract grounded update → reconcile with CRM → assess whether existing BDM already covered it → create candidate → select timing → short opener or direct deadline alert → deeper conversation → reminder/draft/task if requested.

### C. Play discovery

Known interests + approximate area + available window → targeted search → verify date, location and conditions → compare travel/time/budget fit → brief suggestion → details on interest → optional reminder → later feedback without pestering for ratings.

### D. Topic discovery

Active project or interest → targeted research → remove recycled or irrelevant articles → explain one concrete connection → invite discussion. Research may span work, creative inspiration, personal interests and practical wellbeing, without drifting into diagnosis or unsolicited therapy.

### E. Pause and return

Michael pauses through chat, notification reply or settings → persist pause before acknowledgement → stop agent-initiated jobs and sends → cancel queued notifications → show resume time → resume with fresh evidence and no backlog dump. User-initiated chat can still be answered while paused without reactivating the agent.

## 6. Interfaces to build

Build a polished mobile-first responsive web app/PWA, not a marketing landing page. A native app can follow when OS-level integrations justify it.

- **Conversation:** main surface; streaming replies, suggestion references, voice-note transcription if feasible, source links in expanded replies, natural feedback, useful compact actions.
- **Today:** optional quiet overview of important commitments, saved suggestions and reminders. No guilt-inducing scores or giant CRM dashboard.
- **Saved:** ideas, articles, activities and reminders with status and dates.
- **Memory:** plain-language preferences and facts, their sources, confidence and last update; edit/delete/undo.
- **Connections:** real status, permissions, last successful sync, reauthorise and disconnect. No green “Connected” badge for a fixture.
- **Controls:** pause/resume, quiet hours, message frequency, channels, categories, location precision, data export/delete.
- **Pilot diagnostics:** protected developer view of ingestion, decisions, costs and failures. Keep implementation detail out of ordinary screens.

Visual direction: calm, warm, simple typography, generous space and conversation-led. Avoid robot mascots, flashing AI badges, reward streaks and unnecessary charts. Accessibility: keyboard navigation, labels, readable contrast, reduced-motion support and usable mobile input states.

## 7. Integrations and source-of-truth boundaries

| Source | Initial implementation | Later extension / constraints |
|---|---|---|
| Gmail | OAuth; scoped initial backfill; thread/message read and incremental sync | Multiple accounts; draft creation; sending only when separately authorised |
| Google Calendar | Read calendars/events/timezone; detect free windows | Create/update events from explicit requests; availability is not proof of physical location |
| ONT CRM / Google Sheets | Discover selected sheet and inspect actual tabs/headers; read contacts, follow-ups, jobs, financial context | Write through a controlled adapter only if authorised; preserve formulas and existing BDM rules |
| Drive / notes | Selected folders/files or user-provided notes; track revisions | Wider scoped search and supported note-app connectors |
| LinkedIn context | Use existing CRM interaction records, available authorised integrations and explicit exports | Verify actual API permissions; do not invent a personal-message/Sales Navigator API or bypass access controls |
| Financial context | Read selected Jobs & Financials/approved records | Accounting provider connection later if useful; no bank credentials required for pilot |
| Outlook / OneDrive | Adapter contract ready | Implement Microsoft Graph when needed; do not make it a prerequisite for Michael's Google-based pilot |
| Research | Search/fetch adapter returning evidence, publisher and retrieval times | Weather, places, cinemas, events and official venue sources as available |
| Notifications | In-app plus one real external channel: web push preferred initially, SMS if Michael selects it | Channel capability check, Australian delivery, opt-out and reply support; do not assume unrestricted iMessage APIs |
| Health/activity | Not required initially; conversational preferences/check-ins | Explicit opt-in native integration later, if it improves decisions |

Connections in this ChatGPT session are not portable credentials. The deployed app needs its own OAuth registrations, callback URLs and scoped permissions. List genuine external setup needs early and complete everything else without repeatedly asking Michael to make routine technical decisions.

Gmail's documented incremental sync uses history; handle expired/unavailable history cursors with a scoped full resync. Track webhook/watch expiry and renew where applicable. Verify current provider requirements, including Google restricted scopes before wider rollout. A provider setup requirement is a deployment task, not a reason to remove useful integration scope from the product.

Do not ingest entire drives or years of email by default. Make initial windows and selected sources configurable; expand when useful. This is about relevance and cost, not a permanently limited agent.

When two sources disagree, preserve timestamps and provenance. Example: a newer explicit client email may change a job status, while CRM still shows the previous state. Report the discrepancy and propose reconciliation instead of silently changing the financial record. A calendar gap is “looks free on your calendar”, not “you are definitely free”.

## 8. Proposed technical architecture

Use TypeScript and Node.js 24+. For a new project, initialise an **eve** agent runtime, with a React/Next.js frontend following the installed framework's supported integration. The runtime handles durable agent sessions and scheduled work; PostgreSQL holds product state, source records and the delivery ledger. Use an authenticated object store only for files that genuinely need storage. Prefer one deployable app/runtime configuration initially; do not build a microservice estate.

Use the current eve initializer and read its shipped documentation at `node_modules/eve/docs/README.md` before implementing framework-specific APIs. The framework's public setup guide was checked for this brief. Pin installed dependency versions and commit the lockfile. Do not fabricate framework APIs from this document.

Use Vercel AI Gateway model configuration by default; choose a supported model at implementation time and keep the model identifier configurable. Use a cheaper capable model for extraction/ranking and a stronger model only when the task benefits. Do not hardwire one model into the product policy. Maintain an interface for a later provider change.

Logical path:

`Source adapters → normalised records/events → context updates → research/candidate generation → policy gate → transactional outbox → channel → feedback → memory/preferences`

Use one conversational agent with specialised tools and workflows to begin. Multiple model agents are not required to create a sophisticated product. Deterministic application code controls permissions, pauses, deduplication, schedules and delivery limits; the model cannot overrule those controls.

Suggested repository organisation (adapt to generated eve conventions):

```text
agent/                 runtime config, instructions, tools, scheduled workflows
src/domain/            product types, memory rules, relevance/delivery policy
src/connectors/        Google, CRM, notes, research adapters
src/channels/          notification adapters and inbound reply normalisation
src/server/            auth, API handlers, persistence, outbox
src/ui/                conversation, saved, memory, connections, controls
db/                    migrations and database access policies
tests/                 policy, integrations, contract tests, end-to-end scenarios
docs/                  setup, architecture decisions, operations, pilot findings
```

## 9. Data model

Every user-owned table includes `user_id`; enforce isolation at database and service boundaries, including background jobs and vector search. Never rely solely on filtering in the frontend.

| Entity | Key fields / behaviour |
|---|---|
| users | identity, timezone, display name, onboarding state |
| connections | provider, account reference, granted scopes, encrypted credential reference, sync cursor, status, last success |
| source_records | provider ID, connection ID, type, version, content/reference, source timestamps, fetched_at, deletion status |
| facts | entity, attribute, value, source references, observed_at, valid_until, confidence, explicit/inferred, supersedes |
| preferences | topic, polarity/weight, explicit/inferred, scope, provenance, expiry, edited_by |
| goals/projects | title, context, status, source links, next known action, freshness |
| conversations/messages | channel-independent conversation ID, message IDs, roles, reply_to, suggestion ID, timestamps |
| candidates | topic, reason for this user, reason now, evidence, location/date/cost when relevant, scores, expiry, dedupe key, status |
| feedback_events | idempotent event ID, original message reference, parsed intent, target, confirmation state, applied revision |
| reminders | source suggestion/message, local phrase, resolved UTC instant, timezone, status, explicit authorisation |
| control_state | active/paused, pause_until, revision, quiet hours, frequency, channel preferences |
| outbox/deliveries | candidate/user/channel, idempotency key, policy revision, lease, attempt status, provider ID, delivery status |
| job_runs | trigger, user, connection, cursor, attempt, result, retry_at, bounded cost |
| audit_events | action, actor, authorisation, time, redacted details; not a duplicate raw-content archive |

Structured facts and preferences are the source of truth. Semantic retrieval can supplement them but cannot decide whether a task is currently complete, a pause is active or access is authorised. Do not use the model's conversation window as the only memory.

## 10. Proactive selection and research

Generate candidates on meaningful source changes and bounded scheduled research, not continuous expensive polling. Suggested starting rhythm: incremental source updates, one morning discovery pass and one late-afternoon pass, skipped when paused and tuned to observed usefulness. A research pass does not require a message.

For each candidate persist: what happened; why Michael might care; why now; source evidence; freshness; factual confidence; novelty; effort required; expiration; dedupe key; topic; and optional action.

Hard gates precede any model ranking:

1. Correct user and authorised source.
2. Active controls; not paused, muted, expired, snoozed or already covered.
3. Evidence supports the actual wording, including local dates and offer conditions.
4. Delivery budget and quiet hours permit an interruption.
5. Enough relevance to warrant attention.

Then rank candidates by personal relevance, timing, novelty and likely practical benefit. Initial weights are hypotheses, not scientific measurements. The starter policy uses 55% relevance, 25% timing and 20% novelty, plus bounded preference adjustments. Tune from feedback. Do not treat an LLM-assigned score as objective truth.

Select the best item rather than sending every item above a threshold. Preserve variety without forcing a work/play ratio. During work-heavy periods, do not spam lifestyle tips; equally, do not let financial urgency permanently crowd out personal life. User direction wins.

Search discovery is not verification. For events/deals, prefer current organiser/venue pages and check date, location, price and restrictions. Revalidate time-sensitive facts before delivery or booking. Do not claim availability from an old cached page. Research articles can remain useful longer; record publication/update dates and avoid calling an old piece “just released”.

Store only short necessary excerpts plus links, not unauthorised copies of entire paid articles. URLs fetched by backend tools require SSRF protections and bounded size/time. Retrieved pages and emails are untrusted content, never instructions that can change the agent's permissions or system rules.

## 11. Pause, quiet hours and delivery reliability

Pause is a product guarantee. Implement it in application state and workers, not merely in a system prompt.

- Pause indefinitely or until a resolved timestamp.
- Atomically update `control_state`, increment its revision and cancel pending sends before acknowledging.
- Disable new agent-initiated research, source fetching and reminder sends while paused. Incoming provider webhooks may record minimal delivery metadata for later catch-up, but do not enrich content or trigger agent activity.
- Check pause before every background step and again immediately before transport dispatch.
- Do not acknowledge a reminder as fired unless the delivery was actually accepted; reconcile provider outcomes.
- In-flight provider-accepted messages cannot necessarily be recalled. Show that limitation only when relevant; do not promise physical recall. Design per-user dispatch coordination to minimise races.
- User-requested chat during pause works; it does not resume proactive jobs.
- On resume, refresh stale candidates, discard expired opportunities and do not replay a notification backlog.
- Missed reminders while paused are marked as missed and can appear quietly in-app after resume. Never deliver an expired event as upcoming.

Use a transactional outbox, per-user dispatch serialisation/locking and a unique delivery key. Reserve daily capacity atomically so concurrent workers cannot both consume the final slot. Use provider idempotency where supported. On ambiguous transport timeouts, reconcile provider status before retrying: do not blindly send duplicates. Keep user-facing wording honest about pending vs sent vs delivered.

Quiet hours suppress proactive notifications, not user-initiated answers. Ordinary urgency does not override pause. A future critical-alert category requires a separate explicit opt-in and specific rules; it is not part of the first pilot.

The included in-memory gate tests the policy's intent only. It does not implement these distributed guarantees.

## 12. Tools and action permissions

Provide typed tools with schema validation and user-scoped authorisation, including:

- Read/search connected source, read current project context, retrieve personal preferences.
- Search web/places/events, fetch and validate evidence.
- Save candidate, save idea, create/update in-app reminder.
- Apply feedback, pause, resume, inspect current controls.
- Draft email, propose calendar entry, propose CRM update.
- Execute an external write only under an explicit user request or a specific stored standing permission.

Do not ask permission to do every read, research pass or routine operation within an already authorised connection. That would defeat proactive assistance. Do require the appropriate authority for sending messages to others, booking, purchasing or changing authoritative business records. “Yes, tell me more” only authorises details; it is not a purchase approval.

Never store provider passwords. Tokens are encrypted, server-only, revocable and excluded from logs. OAuth state/PKCE where appropriate, webhook signatures and replay protection, authenticated inbound channel ownership, and rate limits are implementation requirements. Email and web text must not be able to instruct the model to disclose credentials or message another recipient.

## 13. Privacy made operational

Build privacy into actual controls rather than slogans:

- User chooses connected sources and can disconnect independently.
- User sees/edit/deletes memory and can export records.
- Document providers, retention and where processing occurs. Do not claim on-device/offline inference or end-to-end encryption unless implemented.
- Keep notification previews generic by default for sensitive work or personal content.
- Separate raw-source retention from useful memory retention. Initial policy: limited configurable raw caches, durable user-approved memory, explicit deletion propagation.
- Memory deletion must remove derived embeddings and summaries and add a suppression/tombstone rule so the next sync does not immediately recreate the forgotten fact from unchanged source data. Explain scope: forgetting a fact versus deleting the original email.
- Disconnect stops new fetches and revokes/deletes credentials where supported; offer clear retained-data deletion controls.
- A full account deletion workflow removes live data and scheduled work and documents backup expiry.
- No personal data in seed fixtures, public previews, analytics payloads or code repositories.

## 14. API contracts to implement

Exact paths can follow the generated framework, but preserve these semantics:

| Endpoint/action | Contract |
|---|---|
| Send user message | authenticated user, idempotency key, conversation ID, optional reply_to; persisted message and streamed answer |
| List conversations/suggestions | user-scoped pagination; no cross-user IDs accepted |
| Apply feedback | typed intent + target + optional resolved time; persist then acknowledge |
| Pause/resume | transactional revision update; idempotent; return actual persisted state |
| Connect/callback/disconnect | provider state verification; scoped credential lifecycle |
| Read/edit memory | provenance and version; avoid overwriting concurrent corrections |
| Provider webhook | validate provider signature/token; dedupe; enqueue bounded work |
| Dispatch job | authenticated internal route; transactional reservation and current policy recheck |
| Export/delete | authenticated ownership; background status; accurate completion state |

All writes accept stable idempotency identifiers where retrying is plausible. Logs expose useful error codes without message bodies or secrets. Errors should give Michael a practical next step, such as reconnecting an expired account, without losing existing context.

## 15. Build milestones and completion evidence

### Milestone 1 — Foundation and conversation

Scaffold the runtime and frontend, real auth, database migrations, user identity, chat persistence, model adapter and control state. Integrate the policy starter. Deliver an authenticated local app where chat works, feedback updates persistent preferences and pause survives restart. Display unconnected sources honestly.

### Milestone 2 — Real work context

Connect Michael's Gmail, Calendar and selected CRM sheet. Implement scoped backfill, incremental updates, provenance and readable connection status. Deliver one real source-backed finding whose source can be opened. Preserve existing BDM logic. If a source requires an account action, isolate that step and continue the other integrations.

### Milestone 3 — Work and play discovery

Add interests, approximate area, targeted research, candidate scoring, evidence validation, saved ideas and short conversational openers. Demonstrate both a work-related discovery and a real after-hours suggestion. Do not narrow the product to “stop working at 5”.

### Milestone 4 — Proactive external delivery

Wire durable scheduling, transactional outbox and one real external notification channel. Demonstrate receipt while the web app is closed, contextual reply, preference learning and suppression of a queued message after pause. Run this with Michael's own authorised channel.

### Milestone 5 — Deployment and daily pilot

Deploy authenticated app and background runtime, apply migrations, configure OAuth callbacks/secrets and verify the whole flow in production. Add cost/health monitoring, backup/recovery instructions and rollback procedure. Run a seven-day personal pilot. Improve findings based on Michael's feedback rather than adding a large feature backlog.

Avoid speculative date promises. Report each milestone as implemented, tested, blocked or not started, with concrete evidence. Do not call the product live because the homepage responds.

## 16. Acceptance scenarios

These are behavioural requirements, not optional polish:

1. **Short opener:** a verified hypothetical deal fixture produces a concise invitation; expanded details appear after interest, with evidence.
2. **No fabricated deal:** missing or stale source evidence prevents a live recommendation.
3. **Urgent work item:** a real deadline is stated directly, not hidden behind “want to know more?”.
4. **Existing BDM:** an already-addressed CRM follow-up does not produce duplicate nagging.
5. **Feedback:** “less of this” reduces only the identified topic; retries do not multiply the adjustment.
6. **Temporary mood:** “I'm flat today” changes today's behaviour without creating a permanent diagnosis or preference.
7. **Pause race:** a pending message cannot dispatch after pause has committed; test competing workers and the transport boundary.
8. **Pause scope:** scheduled research and sync fetches stop; user-requested chat still works.
9. **Resume:** no burst of expired offers or missed nudges.
10. **Timezones:** Friday reminders, Monday resume, midnight budgets and daylight-saving transitions resolve correctly in Sydney.
11. **Thread context:** “yes” refers to the right suggestion across channels; ambiguous replies are clarified.
12. **Quiet hours:** no unsolicited sends; direct replies remain available.
13. **Durability:** server restart preserves memory, reminders, sync cursors and outbox state.
14. **Delivery retries:** provider timeout/retry does not cause duplicate texts or double daily-budget consumption.
15. **Isolation:** one user's source IDs, vector hits, messages or jobs cannot expose another user's data.
16. **Prompt injection:** hostile email/web text cannot change controls or send secrets externally.
17. **Connection failure:** expired OAuth results in accurate status and recovery, not imaginary fresh context.
18. **Forget:** deleted memory does not silently reappear during the next source sync.
19. **Human authority:** “tell me more” cannot send mail to someone else, book or pay.
20. **Real end-to-end:** actual source → candidate → actual external message → Michael's reply → persisted change → altered later behaviour.

Automate policy and integration risks; visually inspect the principal mobile flows. Use synthetic fixtures for adversarial tests. Never send test messages to clients.

## 17. Pilot measurement

Track useful-find feedback, explicitly reported actions, notification dismissals/mutes, accuracy corrections, duplicate rate, cost per useful interaction, and retention of enabled notifications. Do not infer a real-world outing from a link click. Use occasional conversational feedback, not a survey after every suggestion.

Show a private weekly developer summary: which suggestions helped, which annoyed, source failures, facts corrected, spend and changes to try. Sample unanswered messages as unknown rather than failures. The goal is better judgement, not maximum message volume.

Set configurable per-user research/model budgets, per-job limits, bounded fetches and retry backoff. Cache public evidence appropriately, reuse context summaries, and skip pointless scans. Record measured pilot costs before estimating subscription margins.

## 18. What is included in the starter

The accompanying ZIP includes this brief, an agent instruction draft, framework-independent JavaScript policy code, tests and a README.

Implemented in the starter: candidate evidence/freshness checks, relevance weighting, Sydney quiet hours, daily budget, message spacing, topic feedback, snooze, pause/resume, deduplication and an in-memory dispatch recheck demonstration.

Not implemented: the UI, database, OAuth, model calls, natural-language parser, live research, durable scheduler, production outbox, external notifications or deployment. The code is a tested seed for the core behaviour—not a functioning personal assistant yet. Do not misrepresent it in a progress report.

## 19. Cursor's first execution sequence

1. Read this brief, inspect the repo and run the starter tests.
2. Create a task plan mapped to the milestones and record genuine setup dependencies.
3. Initialise eve using its current documented setup; inspect shipped runtime docs before using its APIs. Add the frontend using the documented integration pattern.
4. Add PostgreSQL migrations, authentication and persistent user controls.
5. Wire chat and validated feedback through the domain layer; preserve the brief's tone.
6. Connect the first real source and prove the earliest vertical slice.
7. Continue through the remaining milestones. Do not replace hard integrations with convincing mock screens.
8. Maintain a concise README, environment variable template, migration instructions and a progress ledger with test evidence.
9. Keep credentials out of chat and commits. Ask Michael only for unavoidable account authorisation, a missing credential via a secure mechanism, or a material product decision not answered here.
10. Finish each stage with what works, what was tested and what remains. Never ask Michael to manually perform routine coding or debugging that Cursor can do.

## 20. Technical reference links

Checked on 14 October 2026; use installed version documentation for exact APIs.

- eve setup and runtime: https://eve.dev/docs/getting-started
- Gmail sync: https://developers.google.com/workspace/gmail/api/guides/sync
- Google restricted-scope verification: https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification
- LinkedIn API access: https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access

These references support implementation choices, not a claim that any account is already connected or any integration has been approved. The product requirements and default policy values above are design decisions for this pilot.
