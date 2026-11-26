import { google } from "googleapis";
import {
  getAuthedGoogleClient,
  googleConfigured,
} from "../server/google-oauth";
import {
  getConnection,
  markConnectionError,
  markConnectionSyncSuccess,
  PILOT_USER_ID,
  proactiveAllowed,
  saveCandidate,
  updateConnectionCredentials,
  upsertSourceRecord,
} from "../server/store";

function sheetIdFromEnv(): string | null {
  const raw = process.env.ONT_CRM_SHEET_ID ?? process.env.ONT_CRM_SHEET_URL;
  if (!raw) return null;
  const match = raw.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match?.[1] ?? raw.trim();
}

async function withGoogleClient(userId: string) {
  const conn = await getConnection(userId, "gmail");
  if (!conn?.credentialBlob) {
    throw new Error("Google is not connected");
  }
  const { client, refreshedBlob } = await getAuthedGoogleClient(conn.credentialBlob);
  if (refreshedBlob) {
    for (const provider of ["gmail", "google_calendar", "ont_crm"]) {
      await updateConnectionCredentials(userId, provider, refreshedBlob);
    }
  }
  return { client, connectionId: conn.id };
}

export async function syncGmail(userId = PILOT_USER_ID) {
  const { client, connectionId } = await withGoogleClient(userId);
  const gmail = google.gmail({ version: "v1", auth: client });
  const list = await gmail.users.messages.list({
    userId: "me",
    maxResults: 25,
    q: "newer_than:14d",
  });
  const messages = list.data.messages ?? [];
  let saved = 0;
  for (const msg of messages) {
    if (!msg.id) continue;
    const full = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
      format: "metadata",
      metadataHeaders: ["From", "To", "Subject", "Date"],
    });
    const headers = Object.fromEntries(
      (full.data.payload?.headers ?? []).map((h) => [h.name ?? "", h.value ?? ""]),
    );
    await upsertSourceRecord({
      userId,
      connectionId,
      provider: "gmail",
      externalId: msg.id,
      recordType: "email",
      content: {
        threadId: full.data.threadId,
        snippet: full.data.snippet,
        subject: headers.Subject,
        from: headers.From,
        to: headers.To,
        date: headers.Date,
        labelIds: full.data.labelIds,
      },
      sourceTimestamp: full.data.internalDate
        ? new Date(Number(full.data.internalDate))
        : null,
    });
    saved += 1;
  }
  await markConnectionSyncSuccess(userId, "gmail", list.data.resultSizeEstimate?.toString());
  return { saved };
}

export async function syncCalendar(userId = PILOT_USER_ID) {
  const { client, connectionId } = await withGoogleClient(userId);
  const calendar = google.calendar({ version: "v3", auth: client });
  const now = new Date();
  const inTwoWeeks = new Date(now.getTime() + 14 * 86400_000);
  const events = await calendar.events.list({
    calendarId: "primary",
    timeMin: now.toISOString(),
    timeMax: inTwoWeeks.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 40,
  });
  let saved = 0;
  for (const event of events.data.items ?? []) {
    if (!event.id) continue;
    await upsertSourceRecord({
      userId,
      connectionId,
      provider: "google_calendar",
      externalId: event.id,
      recordType: "event",
      content: {
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: event.start,
        end: event.end,
        htmlLink: event.htmlLink,
        status: event.status,
      },
      sourceTimestamp: event.start?.dateTime
        ? new Date(event.start.dateTime)
        : event.start?.date
          ? new Date(event.start.date)
          : null,
    });
    saved += 1;
  }
  await markConnectionSyncSuccess(userId, "google_calendar");
  return { saved };
}

export async function syncCrmSheet(userId = PILOT_USER_ID) {
  const sheetId = sheetIdFromEnv();
  if (!sheetId) {
    await markConnectionError(
      userId,
      "ont_crm",
      "ONT_CRM_SHEET_ID is not configured",
    );
    return { saved: 0, error: "missing_sheet_id" as const };
  }
  const { client, connectionId } = await withGoogleClient(userId);
  const sheets = google.sheets({ version: "v4", auth: client });
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const tabs = meta.data.sheets?.map((s) => s.properties?.title).filter(Boolean) ?? [];
  let saved = 0;
  for (const title of tabs.slice(0, 8)) {
    const range = `'${String(title).replace(/'/g, "''")}'!A1:Z80`;
    const values = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });
    const rows = values.data.values ?? [];
    if (rows.length === 0) continue;
    const headers = rows[0].map((h) => String(h));
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const record: Record<string, string> = {};
      headers.forEach((h, idx) => {
        if (h) record[h] = String(row[idx] ?? "");
      });
      const externalId = `${title}:${i}`;
      await upsertSourceRecord({
        userId,
        connectionId,
        provider: "ont_crm",
        externalId,
        recordType: "crm_row",
        content: { tab: title, headers, record, sheetId },
      });
      saved += 1;
    }
  }
  await markConnectionSyncSuccess(userId, "ont_crm", sheetId);
  return { saved, tabs };
}

/** Turn recent source records into grounded candidates (not fixtures). */
export async function generateCandidatesFromSources(userId = PILOT_USER_ID) {
  if (!(await proactiveAllowed(userId))) {
    return { created: 0, skipped: "paused" as const };
  }
  const { getDb, schema } = await import("../server/db");
  const { eq, and, desc } = await import("drizzle-orm");
  const db = await getDb();
  const emails = await db
    .select()
    .from(schema.sourceRecords)
    .where(
      and(eq(schema.sourceRecords.userId, userId), eq(schema.sourceRecords.provider, "gmail")),
    )
    .orderBy(desc(schema.sourceRecords.fetchedAt))
    .limit(8);

  let created = 0;
  for (const row of emails) {
    const content = row.content as {
      subject?: string;
      from?: string;
      snippet?: string;
      threadId?: string;
    };
    if (!content.subject && !content.snippet) continue;
    const subject = content.subject ?? "(no subject)";
    const opener = `New mail from ${content.from ?? "someone"}: “${subject.slice(0, 80)}”. Want a look?`;
    const details = [
      `From: ${content.from ?? "unknown"}`,
      `Subject: ${subject}`,
      content.snippet ? `Preview: ${content.snippet}` : null,
      "Source: your connected Gmail (read-only).",
    ]
      .filter(Boolean)
      .join("\n");
    try {
      await saveCandidate(userId, {
        topic: "work",
        title: subject.slice(0, 120),
        opener,
        details,
        reasonForUser: "It landed in your connected inbox.",
        reasonNow: "Recent unread/recent activity in the last sync window.",
        evidence: {
          sourceUrl: content.threadId
            ? `https://mail.google.com/mail/u/0/#inbox/${content.threadId}`
            : undefined,
          sourceLabel: "Gmail",
          fetchedAt: row.fetchedAt.toISOString(),
          excerpt: content.snippet?.slice(0, 240),
          verified: true,
          staleAfter: new Date(Date.now() + 3 * 86400_000).toISOString(),
        },
        relevance: 0.72,
        timing: 0.7,
        novelty: 0.65,
        effort: 0.4,
        dedupeKey: `gmail:${row.externalId}`,
        urgent: /deadline|due|urgent|asap|invoice|quote/i.test(
          `${subject} ${content.snippet ?? ""}`,
        ),
        fixture: false,
      });
      created += 1;
    } catch {
      /* dedupe */
    }
  }

  // CRM follow-ups that look open
  const crm = await db
    .select()
    .from(schema.sourceRecords)
    .where(
      and(eq(schema.sourceRecords.userId, userId), eq(schema.sourceRecords.provider, "ont_crm")),
    )
    .limit(40);
  for (const row of crm) {
    const content = row.content as {
      tab?: string;
      record?: Record<string, string>;
      sheetId?: string;
    };
    const record = content.record ?? {};
    const blob = Object.values(record).join(" ").toLowerCase();
    if (!/(follow.?up|open|pending|quote|due)/i.test(blob)) continue;
    const label =
      record.Client ||
      record.client ||
      record.Name ||
      record.Job ||
      record.Company ||
      content.tab ||
      "CRM row";
    const opener = `CRM still shows something open for ${label}. Want the details?`;
    try {
      await saveCandidate(userId, {
        topic: "work",
        title: `CRM: ${label}`,
        opener,
        details: `Tab: ${content.tab}\n${Object.entries(record)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n")}\n\nSource: ONT CRM sheet (read-only).`,
        reasonForUser: "Your connected CRM sheet still lists this as active/open.",
        reasonNow: "Picked up on the latest sheet sync.",
        evidence: {
          sourceUrl: content.sheetId
            ? `https://docs.google.com/spreadsheets/d/${content.sheetId}`
            : undefined,
          sourceLabel: "ONT CRM",
          fetchedAt: row.fetchedAt.toISOString(),
          verified: true,
          staleAfter: new Date(Date.now() + 2 * 86400_000).toISOString(),
        },
        relevance: 0.7,
        timing: 0.6,
        novelty: 0.5,
        dedupeKey: `crm:${row.externalId}`,
        fixture: false,
      });
      created += 1;
    } catch {
      /* dedupe */
    }
  }

  return { created };
}

export async function syncAllGoogle(userId = PILOT_USER_ID) {
  if (!googleConfigured()) {
    return { ok: false as const, error: "google_not_configured" };
  }
  const results: Record<string, unknown> = {};
  try {
    results.gmail = await syncGmail(userId);
  } catch (e) {
    await markConnectionError(userId, "gmail", e instanceof Error ? e.message : "sync failed");
    results.gmail = { error: String(e) };
  }
  try {
    results.calendar = await syncCalendar(userId);
  } catch (e) {
    await markConnectionError(
      userId,
      "google_calendar",
      e instanceof Error ? e.message : "sync failed",
    );
    results.calendar = { error: String(e) };
  }
  try {
    results.crm = await syncCrmSheet(userId);
  } catch (e) {
    await markConnectionError(userId, "ont_crm", e instanceof Error ? e.message : "sync failed");
    results.crm = { error: String(e) };
  }
  results.candidates = await generateCandidatesFromSources(userId);
  return { ok: true as const, results };
}
