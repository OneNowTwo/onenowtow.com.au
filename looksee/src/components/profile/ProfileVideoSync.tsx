"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type SyncResponse = {
  ok?: boolean;
  results?: Array<{ after?: { status?: string } }>;
};

/** Pull latest Mux processing state into Supabase, then refresh the profile. */
export function ProfileVideoSync() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function syncOnce(): Promise<boolean> {
      const res = await fetch("/api/uploads/sync-stale", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return false;

      const data = (await res.json()) as SyncResponse;
      router.refresh();

      return !data.results?.some((row) => {
        const status = row.after?.status;
        return status === "processing" || status === "uploading";
      });
    }

    async function run() {
      for (let attempt = 0; attempt < 5 && !cancelled; attempt += 1) {
        try {
          const done = await syncOnce();
          if (done) return;
        } catch {
          /* profile still shows last known state */
        }

        if (attempt < 4) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return null;
}
