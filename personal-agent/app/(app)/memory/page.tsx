"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Fact {
  id: string;
  entity: string;
  attribute: string;
  value: string;
  confidence: number;
  explicit: boolean;
  sourceRefs: string[];
}

interface Pref {
  id: string;
  topic: string;
  polarity: string;
  weight: number;
  provenance: string | null;
  expiresAt: string | null;
}

export default function MemoryPage() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [prefs, setPrefs] = useState<Pref[]>([]);
  const [entity, setEntity] = useState("michael");
  const [attribute, setAttribute] = useState("interest");
  const [value, setValue] = useState("");

  async function load() {
    const res = await fetch("/api/memory");
    if (!res.ok) return;
    const data = (await res.json()) as { facts: Fact[]; preferences: Pref[] };
    setFacts(data.facts);
    setPrefs(data.preferences);
  }

  useEffect(() => {
    void load();
  }, []);

  async function addFact(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/memory", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ entity, attribute, value }),
    });
    setValue("");
    await load();
  }

  async function removeFact(id: string) {
    await fetch(`/api/memory?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="pa-panel">
      <h1>What I know so far</h1>
      <p className="pa-lede">
        Plain-language facts and preferences. Edit or delete anytime. Forgetting a fact does not
        delete the original email.
      </p>

      <section className="pa-section">
        <h2>Facts</h2>
        {facts.length === 0 ? <p className="pa-muted">Nothing stored yet.</p> : null}
        <ul className="pa-list">
          {facts.map((f) => (
            <li key={f.id}>
              <div>
                <strong>
                  {f.entity}.{f.attribute}
                </strong>
                : {f.value}
                <div className="pa-meta">
                  {f.explicit ? "explicit" : "inferred"} · confidence {f.confidence}% ·{" "}
                  {(f.sourceRefs ?? []).join(", ") || "unknown source"}
                </div>
              </div>
              <Button type="button" variant="ghost" onClick={() => void removeFact(f.id)}>
                Forget
              </Button>
            </li>
          ))}
        </ul>
        <form className="pa-form" onSubmit={(e) => void addFact(e)}>
          <label htmlFor="entity">Entity</label>
          <input id="entity" value={entity} onChange={(e) => setEntity(e.target.value)} />
          <label htmlFor="attribute">Attribute</label>
          <input
            id="attribute"
            value={attribute}
            onChange={(e) => setAttribute(e.target.value)}
          />
          <label htmlFor="value">Value</label>
          <input
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
          <Button type="submit">Save fact</Button>
        </form>
      </section>

      <section className="pa-section">
        <h2>Preferences</h2>
        {prefs.length === 0 ? <p className="pa-muted">No preference adjustments yet.</p> : null}
        <ul className="pa-list">
          {prefs.map((p) => (
            <li key={p.id}>
              <div>
                <strong>{p.topic}</strong> · {p.polarity} · weight {p.weight}
                <div className="pa-meta">
                  {p.provenance ?? "feedback"}
                  {p.expiresAt ? ` · expires ${new Date(p.expiresAt).toLocaleString("en-AU")}` : ""}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
