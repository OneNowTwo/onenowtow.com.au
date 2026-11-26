# What Michael needs to do (only what Cursor cannot)

Cursor is building and testing the rest. These steps need your accounts.

## 1. Private GitHub repository

1. Create a **private** repo (suggested name: `personal-agent`) — no README needed.
2. Paste the repo URL into the Cursor chat.
3. Grant the Cursor GitHub App access to that private repo.

Cursor will push the code and open PRs there. The ONT website stays in `onenowtow.com.au`.

## 2. Google Cloud OAuth

Open: https://console.cloud.google.com/apis/credentials

1. Create/select project **Personal Agent**.
2. Enable APIs: **Gmail**, **Google Calendar**, **Google Sheets**.
3. OAuth consent screen → add yourself as a test user.
4. Create **OAuth client ID → Web application**.
5. Redirect URIs:
   - `http://localhost:3000/api/auth/google/callback`
   - `http://localhost:3000/api/connections/google/callback`
   - `https://<preview-domain>/api/auth/google/callback`
   - `https://<preview-domain>/api/connections/google/callback`
6. Add secrets in Cursor / Vercel:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `SESSION_SECRET` (long random)
   - `TOKEN_ENCRYPTION_KEY` (different long random)
   - `PILOT_EMAIL` (your Google email)

## 3. ONT CRM sheet

Paste the Google Sheets URL (or ID) for the CRM workbook into chat / as `ONT_CRM_SHEET_ID`.

## 4. Vercel + AI Gateway

1. Authenticate Vercel for this Cursor agent when prompted.
2. Confirm AI Gateway is available on your Vercel team.
3. Cursor will deploy a preview URL you can open and test.

## After that

1. Open the preview → **Continue with Google**.
2. **Connections → Connect Google**.
3. Chat should use the live model; suggestions come from real Gmail/Calendar/CRM sync (fixtures stay labelled if used).
