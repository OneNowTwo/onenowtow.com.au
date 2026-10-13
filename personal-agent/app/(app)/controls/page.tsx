"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Controls {
  paused: boolean;
  pauseUntil: string | null;
  revision: number;
  quietHoursStart: string;
  quietHoursEnd: string;
  maxMessagesPerDay: number;
  minSpacingMinutes: number;
  activityLevel: string;
  channelPrefs: { inApp: boolean; webPush: boolean; sms: boolean };
}

export default function ControlsPage() {
  const [controls, setControls] = useState<Controls | null>(null);
  const [ack, setAck] = useState<string>();

  async function load() {
    const res = await fetch("/api/controls");
    if (!res.ok) return;
    const data = (await res.json()) as { controls: Controls };
    setControls(data.controls);
  }

  useEffect(() => {
    void load();
  }, []);

  async function pause() {
    const res = await fetch("/api/controls", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "pause" }),
    });
    const data = (await res.json()) as { controls: Controls };
    setControls(data.controls);
    setAck("Paused. Scheduled nudges and background research stop.");
  }

  async function resume() {
    const res = await fetch("/api/controls", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "resume" }),
    });
    const data = (await res.json()) as { controls: Controls };
    setControls(data.controls);
    setAck("Back on — no backlog dump.");
  }

  async function saveLevel(activityLevel: string) {
    const res = await fetch("/api/controls", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "update", patch: { activityLevel } }),
    });
    const data = (await res.json()) as { controls: Controls };
    setControls(data.controls);
  }

  if (!controls) {
    return (
      <div className="pa-panel">
        <p>Sign in to manage controls.</p>
      </div>
    );
  }

  return (
    <div className="pa-panel">
      <h1>Controls</h1>
      <p className="pa-lede">
        Pause is a real guarantee — not just hiding notifications. Quiet hours suppress proactive
        pings; you can still chat.
      </p>

      <section className="pa-section">
        <h2>Pause</h2>
        <p>
          Status:{" "}
          <strong>{controls.paused ? "Paused" : "Active"}</strong>
          {controls.pauseUntil
            ? ` until ${new Date(controls.pauseUntil).toLocaleString("en-AU", { timeZone: "Australia/Sydney" })}`
            : ""}
          <span className="pa-meta"> · revision {controls.revision}</span>
        </p>
        <div className="pa-actions">
          <Button type="button" onClick={() => void pause()}>
            Pause now
          </Button>
          <Button type="button" variant="ghost" onClick={() => void resume()}>
            Resume
          </Button>
        </div>
        {ack ? <p className="pa-ack">{ack}</p> : null}
      </section>

      <section className="pa-section">
        <h2>Activity level</h2>
        <div className="pa-actions">
          {(["quiet", "balanced", "proactive"] as const).map((level) => (
            <Button
              key={level}
              type="button"
              variant={controls.activityLevel === level ? "default" : "ghost"}
              onClick={() => void saveLevel(level)}
            >
              {level}
            </Button>
          ))}
        </div>
        <p className="pa-meta">
          Balanced default: {controls.maxMessagesPerDay}/day, {controls.minSpacingMinutes} min
          spacing, quiet {controls.quietHoursStart}–{controls.quietHoursEnd} Sydney.
        </p>
      </section>

      <section className="pa-section">
        <h2>Channels</h2>
        <ul className="pa-list">
          <li>In-app: {controls.channelPrefs.inApp ? "on" : "off"}</li>
          <li>Web push: {controls.channelPrefs.webPush ? "on" : "off"} (Milestone 4)</li>
          <li>SMS: {controls.channelPrefs.sms ? "on" : "off"} (optional later)</li>
        </ul>
      </section>
    </div>
  );
}
