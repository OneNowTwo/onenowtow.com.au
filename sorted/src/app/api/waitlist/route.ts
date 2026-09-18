import { NextResponse } from "next/server";
import { isSupabaseAdminConfigured, isSupabaseConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; feature?: string };
  const email = body.email?.trim().toLowerCase();
  const feature = body.feature || "sorted-3";
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  if (isSupabaseConfigured() && isSupabaseAdminConfigured()) {
    try {
      const supabase = createAdminClient();
      await supabase.from("waitlist").insert({ email, feature });
    } catch (error) {
      console.info("[sorted:waitlist] supabase insert skipped", error);
    }
  } else {
    console.info("[sorted:waitlist]", { email, feature });
  }

  return NextResponse.json({ ok: true });
}
