"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Suggestion = Record<string, unknown>;

export function AdminSuggestions({ suggestions }: { suggestions: Suggestion[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function update(id: string, status: "approved" | "rejected") {
    setError(null);
    const res = await fetch("/api/admin/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "Failed");
      return;
    }
    router.refresh();
  }

  if (suggestions.length === 0) {
    return <p className="text-sm text-muted">No pending hostel suggestions.</p>;
  }

  return (
    <div className="space-y-3">
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {suggestions.map((s) => (
        <div key={String(s.id)} className="rounded-2xl bg-card p-4 ring-1 ring-border">
          <p className="font-semibold">{String(s.name)}</p>
          <p className="text-sm text-muted">{String(s.destination)}</p>
          {s.notes ? <p className="mt-2 text-sm">{String(s.notes)}</p> : null}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => void update(String(s.id), "approved")}
              className="h-9 rounded-lg bg-accent px-3 text-xs font-bold text-white"
            >
              Mark reviewed
            </button>
            <button
              type="button"
              onClick={() => void update(String(s.id), "rejected")}
              className="h-9 rounded-lg bg-muted-bg px-3 text-xs font-bold"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
