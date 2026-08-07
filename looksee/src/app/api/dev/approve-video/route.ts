import { NextResponse } from "next/server";
import { isDevModerationEnabled } from "@/lib/auth/dev-user";
import { AuthError, requireAdmin } from "@/lib/auth/session";
import { approveVideoAsAdmin, listUploadedVideos } from "@/lib/db/videos";
import { approveVideoSchema } from "@/lib/validation/mvp";
import { revalidatePath } from "next/cache";
import { seedHostelsWithCounts } from "@/lib/seed/data";

/**
 * Legacy development moderation endpoint.
 * Prefer /api/admin/videos with a real admin account.
 */
export async function GET() {
  if (!isDevModerationEnabled()) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }
  try {
    await requireAdmin();
  } catch {
    // allow listing in local/dev only when ALLOW_DEV_MODERATION is on without admin —
    // still prefer admin role when present
  }
  const videos = await listUploadedVideos();
  return NextResponse.json({
    videos: videos.filter((v) => v.status === "pending" || v.status === "ready"),
  });
}

export async function POST(request: Request) {
  try {
    if (!isDevModerationEnabled()) {
      return NextResponse.json({ error: "Not available" }, { status: 404 });
    }
    const admin = await requireAdmin();
    const parsed = approveVideoSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const video = await approveVideoAsAdmin(parsed.data.videoId, admin.id);
    const hostel = seedHostelsWithCounts.find((h) => h.id === video.hostel_id);
    revalidatePath("/");
    if (hostel) revalidatePath(`/hostel/${hostel.slug}`);
    return NextResponse.json({ video });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Could not approve video.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
