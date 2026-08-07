"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics/posthog";
import { cn } from "@/lib/utils/cn";

type Props = {
  videoId: string;
  initialCount: number;
  initiallyHelpful: boolean;
  isOwner: boolean;
  signedIn: boolean;
};

export function HelpfulButton({
  videoId,
  initialCount,
  initiallyHelpful,
  isOwner,
  signedIn,
}: Props) {
  const router = useRouter();
  const [count, setCount] = useState(initialCount);
  const [helpful, setHelpful] = useState(initiallyHelpful);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    if (isOwner) return;
    if (!signedIn) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const prevHelpful = helpful;
    const prevCount = count;
    setHelpful(!prevHelpful);
    setCount(prevHelpful ? Math.max(prevCount - 1, 0) : prevCount + 1);
    setPending(true);
    setError(null);

    try {
      const res = await fetch("/api/helpful", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });
      const data = (await res.json()) as {
        error?: string;
        helpful?: boolean;
        count?: number;
      };
      if (!res.ok) throw new Error(data.error ?? "Could not update Helpful");
      setHelpful(Boolean(data.helpful));
      setCount(Number(data.count ?? 0));
      track(data.helpful ? "helpful_clicked" : "helpful_removed", {
        video_id: videoId,
      });
    } catch (err) {
      setHelpful(prevHelpful);
      setCount(prevCount);
      setError(err instanceof Error ? err.message : "Could not update Helpful");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={pending || isOwner}
        onClick={() => void toggle()}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition",
          helpful ? "bg-accent-soft text-accent" : "bg-muted-bg text-muted",
          isOwner && "cursor-not-allowed opacity-50",
        )}
        title={isOwner ? "You can’t mark your own Looksee helpful" : "Mark helpful"}
      >
        <ThumbsUp className="h-3.5 w-3.5" />
        Helpful
        <span className="tabular-nums">{count}</span>
      </button>
      {error ? <p className="mt-1 text-[11px] text-danger">{error}</p> : null}
    </div>
  );
}
