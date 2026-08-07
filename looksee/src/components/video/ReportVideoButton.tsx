"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { useRouter } from "next/navigation";

const REASONS = [
  { value: "inaccurate_misleading", label: "Inaccurate / misleading" },
  { value: "offensive", label: "Offensive" },
  { value: "privacy", label: "Privacy issue" },
  { value: "commercial_promotional", label: "Commercial / promotional" },
  { value: "wrong_hostel", label: "Wrong hostel" },
  { value: "other", label: "Other" },
] as const;

type Props = {
  videoId: string;
  signedIn: boolean;
};

export function ReportVideoButton({ videoId, signedIn }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<(typeof REASONS)[number]["value"]>("inaccurate_misleading");
  const [details, setDetails] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit() {
    if (!signedIn) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, reason, details: details || undefined }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not submit report");
      setMessage("Thanks — we’ll review this Looksee.");
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit report");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-foreground"
      >
        <Flag className="h-3 w-3" />
        Report
      </button>
      {message ? <p className="mt-1 text-[11px] text-success">{message}</p> : null}
      {open ? (
        <div className="mt-2 space-y-2 rounded-xl bg-muted-bg p-3">
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as typeof reason)}
            className="h-10 w-full rounded-lg bg-card px-2 text-sm ring-1 ring-border"
          >
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value.slice(0, 500))}
            placeholder="Optional details"
            rows={2}
            className="w-full rounded-lg bg-card px-2 py-2 text-sm ring-1 ring-border"
          />
          {error ? <p className="text-[11px] text-danger">{error}</p> : null}
          <button
            type="button"
            disabled={pending}
            onClick={() => void submit()}
            className="h-9 rounded-lg bg-foreground px-3 text-xs font-bold text-white"
          >
            Submit report
          </button>
        </div>
      ) : null}
    </div>
  );
}
