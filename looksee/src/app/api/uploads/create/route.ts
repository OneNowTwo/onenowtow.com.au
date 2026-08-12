import { NextResponse } from "next/server";
import { AuthError, requireAuthUserId } from "@/lib/auth/session";
import { createDirectUpload, isMuxConfigured } from "@/lib/mux/client";
import { createUploadVideoBeforeMux, listVideosForUser, patchVideo } from "@/lib/db/videos";
import { resolveHostelIdForUpload } from "@/lib/db/hostels";
import {
  allowLocalDataStore,
  getAppUrl,
  isSupabaseAdminConfigured,
} from "@/lib/env";
import { createUploadSchema } from "@/lib/validation/mvp";
import { assertCanCreateUpload, UploadLimitError } from "@/lib/uploads/limits";

export async function POST(request: Request) {
  try {
    const userId = await requireAuthUserId();

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

    const hostelId = await resolveHostelIdForUpload(parsed.data.hostelId);
    if (!hostelId) {
      return NextResponse.json({ error: "That hostel could not be found." }, { status: 404 });
    }

    const filmedAt = parsed.data.filmedAt ?? new Date().toISOString().slice(0, 10);

    const existing = await listVideosForUser(userId);
    assertCanCreateUpload(existing, {
      userId,
      hostelId,
      category: parsed.data.category,
      filmedAt,
    });

    const video = await createUploadVideoBeforeMux({
      userId,
      hostelId,
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
    if (error instanceof UploadLimitError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message =
      error instanceof Error ? error.message : "Could not create a Mux upload URL.";
    console.error("[uploads/create]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
