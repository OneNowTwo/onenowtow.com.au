"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

interface ConnectionRow {
  provider: string;
  status: string;
  fixture: boolean;
  lastSuccessAt: string | null;
  accountRef: string | null;
  note?: string;
  errorMessage?: string | null;
}

function ConnectionsInner() {
  const params = useSearchParams();
  const [rows, setRows] = useState<ConnectionRow[]>([]);
  const [setup, setSetup] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>();

  async function load() {
    const res = await fetch("/api/connections");
    if (!res.ok) return;
    const data = (await res.json()) as {
      connections: ConnectionRow[];
      setupRequired: string[];
    };
    setRows(data.connections);
    setSetup(data.setupRequired);
  }

  useEffect(() => {
    void load();
    if (params.get("connected")) setMessage("Google connected — first sync completed.");
    if (params.get("error")) setMessage(`Connection issue: ${params.get("error")}`);
  }, [params]);

  async function syncNow() {
    setBusy(true);
    setMessage(undefined);
    const res = await fetch("/api/connections/google/sync", { method: "POST" });
    setBusy(false);
    const data = await res.json().catch(() => ({}));
    setMessage(res.ok ? `Sync finished: ${JSON.stringify(data.results ?? data)}` : "Sync failed");
    await load();
  }

  async function disconnect() {
    setBusy(true);
    await fetch("/api/connections/google/disconnect", { method: "POST" });
    setBusy(false);
    setMessage("Disconnected Google accounts.");
    await load();
  }

  const googleConnected = rows.some(
    (r) =>
      ["gmail", "google_calendar", "ont_crm"].includes(r.provider) && r.status === "connected",
  );

  return (
    <div className="pa-panel">
      <h1>Connections</h1>
      <p className="pa-lede">
        Real status only. Connect Google once for Gmail, Calendar and your ONT CRM sheet. Tokens stay
        encrypted server-side; nothing is written back without your explicit ask.
      </p>
      {message ? <p className="pa-ack">{message}</p> : null}

      <div className="pa-actions" style={{ marginBottom: "1.25rem" }}>
        <Button asChild disabled={busy}>
          <a href="/api/connections/google/start?returnTo=/connections">
            {googleConnected ? "Reconnect Google" : "Connect Google (Gmail · Calendar · CRM)"}
          </a>
        </Button>
        <Button type="button" variant="ghost" disabled={busy || !googleConnected} onClick={() => void syncNow()}>
          Sync now
        </Button>
        <Button type="button" variant="ghost" disabled={busy || !googleConnected} onClick={() => void disconnect()}>
          Disconnect
        </Button>
      </div>

      <ul className="pa-list">
        {rows.map((r) => (
          <li key={r.provider}>
            <div>
              <strong>{r.provider}</strong>
              <div className="pa-meta">
                status: {r.status}
                {r.fixture ? " · FIXTURE" : ""}
                {r.accountRef ? ` · ${r.accountRef}` : ""}
                {r.lastSuccessAt
                  ? ` · last sync ${new Date(r.lastSuccessAt).toLocaleString("en-AU")}`
                  : " · never synced"}
              </div>
              {r.errorMessage ? <div className="pa-error">{r.errorMessage}</div> : null}
              {r.note ? <div className="pa-muted">{r.note}</div> : null}
            </div>
          </li>
        ))}
      </ul>

      <section className="pa-section">
        <h2>Still needed from you</h2>
        <ul className="pa-list">
          {setup.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function ConnectionsPage() {
  return (
    <Suspense fallback={<div className="pa-panel">Loading…</div>}>
      <ConnectionsInner />
    </Suspense>
  );
}
