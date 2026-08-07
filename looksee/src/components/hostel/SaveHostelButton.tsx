"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics/posthog";
import { cn } from "@/lib/utils/cn";

type Props = {
  hostelId: string;
  hostelSlug?: string;
  initiallySaved: boolean;
  signedIn: boolean;
};

export function SaveHostelButton({
  hostelId,
  hostelSlug,
  initiallySaved,
  signedIn,
}: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(initiallySaved);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (!signedIn) {
      router.push(
        `/login?next=${encodeURIComponent(hostelSlug ? `/hostel/${hostelSlug}` : "/saved")}`,
      );
      return;
    }

    const prev = saved;
    setSaved(!prev);
    setPending(true);
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostelId }),
      });
      const data = (await res.json()) as { error?: string; saved?: boolean };
      if (!res.ok) throw new Error(data.error ?? "Could not update save");
      setSaved(Boolean(data.saved));
      track(data.saved ? "hostel_saved" : "hostel_unsaved", { hostel_id: hostelId });
    } catch {
      setSaved(prev);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => void toggle()}
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
        saved ? "bg-accent-soft text-accent" : "bg-muted-bg text-muted",
      )}
      aria-label={saved ? "Unsave hostel" : "Save hostel"}
    >
      <Bookmark className={cn("h-5 w-5", saved && "fill-current")} />
    </button>
  );
}
