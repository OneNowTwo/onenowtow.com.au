import { NextResponse } from "next/server";
import { AuthError, requireAuthUserId } from "@/lib/auth/session";
import { getVideoById, patchVideo, submitVideoMetadata, syncVideoStatusFromMux } from "@/lib/db/videos";
import { submitMetadataSchema } from "@/lib/validation/mvp";
import { filmedAtLimitError } from "@/lib/uploads/limits";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const userId = await requireAuthUserId();
    const { id } = await params;
    const body: unknown = await request.json();
    const action =
      typeof body === "object" && body && "action" in body
        ? String((body as { action?: string }).action)
        : "submit";

    const existing = await getVideoById(id);
    if (!existing) {
      return NextResponse.json({ error: "Video not found." }, { status: 404 });
    }
    if (existing.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (action === "processing") {
      const video = await patchVideo(id, { status: "processing" });
      return NextResponse.json({ video });
    }

    const parsed = submitMetadataSchema.safeParse({
      ...(typeof body === "object" && body ? body : {}),
      videoId: id,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid metadata" },
        { status: 400 },
      );
    }

    const filmedError = filmedAtLimitError(parsed.data.filmedAt);
    if (filmedError) {
      return NextResponse.json({ error: filmedError }, { status: 400 });
    }

    const video = await submitVideoMetadata({
      videoId: parsed.data.videoId,
      userId,
      caption: parsed.data.caption?.trim() ? parsed.data.caption.trim() : null,
      filmedAt: parsed.data.filmedAt,
      rating: parsed.data.rating,
    });

    return NextResponse.json({ video });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message =
      error instanceof Error ? error.message : "Could not update video metadata.";
    console.error("[uploads/metadata]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const userId = await requireAuthUserId();
    const { id } = await params;
    let video = await getVideoById(id);
    if (!video) {
      return NextResponse.json({ error: "Video not found." }, { status: 404 });
    }

    if (video.status === "uploading" || video.status === "processing") {
      try {
        video = (await syncVideoStatusFromMux(id)) ?? video;
      } catch (error) {
        console.error("[uploads/status]", id, error);
      }
    }
    if (video.user_id !== userId) {
      const { getSessionUser } = await import("@/lib/auth/session");
      const session = await getSessionUser();
      if (session?.profile?.role !== "admin" && video.user_id !== session?.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    return NextResponse.json({ video });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message =
      error instanceof Error ? error.message : "Could not load video status.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
