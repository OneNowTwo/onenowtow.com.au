"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";

/** Shows Sign in when logged out, Profile when logged in. */
export function AuthNavLink({ className }: { className?: string }) {
  const configured = isSupabaseConfigured();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    void supabase.auth.getSession().then(({ data }) => {
      setSignedIn(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, [configured]);

  if (!configured || !signedIn) {
    return (
      <Link href="/login" className={className}>
        Sign in
      </Link>
    );
  }

  return (
    <Link href="/profile" className={className}>
      Profile
    </Link>
  );
}
