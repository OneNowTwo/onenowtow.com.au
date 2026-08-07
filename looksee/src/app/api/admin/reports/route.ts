import { NextResponse } from "next/server";
import { AuthError, requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { hideVideoAsAdmin } from "@/lib/db/videos";
import { z } from "zod";

const schema = z.object({
  reportId: z.string().min(8),
  action: z.enum(["dismiss", "hide"]),
});

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const client = createAdminClient();
    const { data: report } = await client
      .from("video_reports")
      .select("*")
      .eq("id", parsed.data.reportId)
      .maybeSingle();

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (parsed.data.action === "hide") {
      await hideVideoAsAdmin(String(report.video_id));
      await client
        .from("video_reports")
        .update({
          status: "actioned",
          reviewed_at: new Date().toISOString(),
          reviewed_by: admin.id,
        })
        .eq("id", parsed.data.reportId);
    } else {
      await client
        .from("video_reports")
        .update({
          status: "dismissed",
          reviewed_at: new Date().toISOString(),
          reviewed_by: admin.id,
        })
        .eq("id", parsed.data.reportId);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
