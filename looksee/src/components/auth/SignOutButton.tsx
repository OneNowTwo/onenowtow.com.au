"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { track } from "@/lib/analytics/posthog";

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="text-sm font-semibold text-muted hover:text-foreground"
      onClick={async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        track("login_completed", { action: "sign_out" });
        router.push("/");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
