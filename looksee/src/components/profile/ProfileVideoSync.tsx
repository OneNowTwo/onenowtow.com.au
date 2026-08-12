"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/** Pull latest Mux processing state into Supabase, then refresh the profile. */
export function ProfileVideoSync() {
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    void fetch("/api/uploads/sync-stale", { method: "POST" })
      .then((res) => {
        if (res.ok) router.refresh();
      })
      .catch(() => {
        /* ignore — profile still shows last known state */
      });
  }, [router]);

  return null;
}
