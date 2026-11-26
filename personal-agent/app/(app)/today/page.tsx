"use client";

import { useEffect, useState } from "react";

export default function TodayPage() {
  const [paused, setPaused] = useState<boolean | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/controls");
      if (!res.ok) return;
      const data = (await res.json()) as { controls: { paused: boolean } };
      setPaused(data.controls.paused);
    })();
  }, []);

  return (
    <div className="pa-panel">
      <h1>Today</h1>
      <p className="pa-lede">
        Quiet overview — commitments, saved suggestions and reminders. No guilt scores.
      </p>
      <p>
        Agent is{" "}
        <strong>
          {paused === null ? "…" : paused ? "paused" : "active"}
        </strong>
        .
      </p>
      <p className="pa-muted">
        Live calendar and CRM items appear here after Milestone 2 connections. Until then, use Chat
        and labelled FIXTURE suggestions only.
      </p>
    </div>
  );
}
