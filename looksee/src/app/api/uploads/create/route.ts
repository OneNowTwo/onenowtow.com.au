import { NextResponse } from "next/server";
import { AuthError, requireUser } from "@/lib/auth/session";
import { createDirectUpload, isMuxConfigured } from "@/lib/mux/client";
import { createUploadVideoBeforeMux, patchVideo } from "@/lib/db/videos";
import {
  allowLocalDataStore,
  getAppUrl,
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
} from "@/lib/env";
import { createUploadSchema } from "@/lib/validation/mvp";
import { seedHostelsWithCounts } from "@/lib/seed/data";
import { createAdminClient } from "@/lib/supabase/admin";

async function hostelExists(hostelId: string): Promise<boolean> {
  if (seedHostelsWithCounts.some((h) => h.id === hostelId && h.active)) return true;
  if (!isSupabaseConfigured()) return false;
  const admin = createAdminClient();
  const { data } = await admin
    .from("hostels")
    .select("id")
    .eq("id", hostelId)
    .eq("active", true)
    .maybeSingle();
  return Boolean(data);
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    if (!allowLocalDataStore() && !isSupabaseAdminConfigured()) {
      return NextResponse.json(
        {
          error:
            "Supabase service role is required in production. Set SUPABASE_SERVICE_ROLE_KEY on Vercel.",
        },
        { status: 503 },
      );
    }

    if (!isMuxConfigured()) {
      return NextResponse.json(
        {
          error:
            "Mux is not configured. Add MUX_TOKEN_ID and MUX_TOKEN_SECRET to the environment.",
        },
        { status: 503 },
      );
    }

    const appUrl = getAppUrl();
    if (!allowLocalDataStore() && (!appUrl || appUrl.includes("localhost"))) {
      return NextResponse.json(
        {
          error:
            "Set NEXT_PUBLIC_APP_URL to your public https URL (Mux CORS will fail on localhost in production).",
        },
        { status: 503 },
      );
    }

    const body: unknown = await request.json();
    const parsed = createUploadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid upload request" },
        { status: 400 },
      );
    }

    if (!(await hostelExists(parsed.data.hostelId))) {
      return NextResponse.json({ error: "That hostel could not be found." }, { status: 404 });
    }

    const filmedAt = parsed.data.filmedAt ?? new Date().toISOString().slice(0, 10);

    const video = await createUploadVideoBeforeMux({
      userId: user.id,
      hostelId: parsed.data.hostelId,
      category: parsed.data.category,
      filmedAt,
    });

    const upload = await createDirectUpload({
      videoId: video.id,
      corsOrigin: getAppUrl(),
    });

    const updated = await patchVideo(video.id, {
      mux_upload_id: upload.uploadId,
      status: "uploading",
    });

    return NextResponse.json({
      videoId: video.id,
      uploadId: upload.uploadId,
      uploadUrl: upload.uploadUrl,
      status: updated?.status ?? "uploading",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message =
      error instanceof Error ? error.message : "Could not create a Mux upload URL.";
    console.error("[uploads/create]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
