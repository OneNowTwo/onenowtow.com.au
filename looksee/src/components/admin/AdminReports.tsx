"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ReportRow = Record<string, unknown>;

export function AdminReports({ reports }: { reports: ReportRow[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function act(reportId: string, action: "dismiss" | "hide") {
    setError(null);
    const res = await fetch("/api/admin/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId, action }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "Failed");
      return;
    }
    router.refresh();
  }

  if (reports.length === 0) {
    return <p className="text-sm text-muted">No open reports.</p>;
  }

  return (
    <div className="space-y-3">
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {reports.map((report) => (
        <div key={String(report.id)} className="rounded-2xl bg-card p-4 ring-1 ring-border">
          <p className="text-sm font-semibold">{String(report.reason)}</p>
          <p className="mt-1 text-xs text-muted">
            Video {String((report.videos as { id?: string } | null)?.id ?? report.video_id)} ·{" "}
            {new Date(String(report.created_at)).toLocaleString()}
          </p>
          {report.details ? <p className="mt-2 text-sm">{String(report.details)}</p> : null}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => void act(String(report.id), "dismiss")}
              className="h-9 rounded-lg bg-muted-bg px-3 text-xs font-bold"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={() => void act(String(report.id), "hide")}
              className="h-9 rounded-lg bg-danger px-3 text-xs font-bold text-white"
            >
              Hide video
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
