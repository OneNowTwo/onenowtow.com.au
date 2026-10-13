"use client";

import { useEffect, useState } from "react";

interface ConnectionRow {
  provider: string;
  status: string;
  fixture: boolean;
  lastSuccessAt: string | null;
  accountRef: string | null;
  note?: string;
}

export default function ConnectionsPage() {
  const [rows, setRows] = useState<ConnectionRow[]>([]);
  const [setup, setSetup] = useState<string[]>([]);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/connections");
      if (!res.ok) return;
      const data = (await res.json()) as {
        connections: ConnectionRow[];
        setupRequired: string[];
      };
      setRows(data.connections);
      setSetup(data.setupRequired);
    })();
  }, []);

  return (
    <div className="pa-panel">
      <h1>Connections</h1>
      <p className="pa-lede">
        Real status only. A green Connected badge never appears for fixtures or wishful thinking.
      </p>
      <ul className="pa-list">
        {rows.map((r) => (
          <li key={r.provider}>
            <div>
              <strong>{r.provider}</strong>
              <div className="pa-meta">
                status: {r.status}
                {r.fixture ? " · FIXTURE" : ""}
                {r.lastSuccessAt
                  ? ` · last sync ${new Date(r.lastSuccessAt).toLocaleString("en-AU")}`
                  : " · never synced"}
              </div>
              {r.note ? <div className="pa-muted">{r.note}</div> : null}
            </div>
          </li>
        ))}
      </ul>
      <section className="pa-section">
        <h2>External setup still needed</h2>
        <ul className="pa-list">
          {setup.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="pa-muted">
          Google OAuth must be registered against this deployment&apos;s callback URL. ChatGPT
          session connections are not portable credentials.
        </p>
      </section>
    </div>
  );
}
