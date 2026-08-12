import { NextResponse } from "next/server";
import { AuthError, requireAdmin } from "@/lib/auth/session";
import {
  approveVideoAsAdmin,
  hideVideoAsAdmin,
  listUploadedVideos,
  rejectVideoAsAdmin,
} from "@/lib/db/videos";
import { approveVideoSchema } from "@/lib/validation/mvp";
import { revalidatePath } from "next/cache";
import { seedDestinations } from "@/lib/seed/data";
import { findSeedHostelByAnyId } from "@/lib/db/hostels";

export async function GET() {
  try {
    await requireAdmin();
    const videos = await listUploadedVideos();
    const pending = videos.filter((v) => v.status === "pending" || v.status === "ready");
    return NextResponse.json({ videos: pending });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Failed to load pending videos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = (await request.json()) as {
      videoId?: string;
      action?: "approve" | "reject" | "hide";
      reason?: string;
    };

    const parsed = approveVideoSchema.safeParse({
      videoId: body.videoId,
      reason: body.reason,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 },
      );
    }

    const action = body.action ?? "approve";
    let video;
    if (action === "approve") {
      video = await approveVideoAsAdmin(parsed.data.videoId, admin.id);
    } else if (action === "reject") {
      video = await rejectVideoAsAdmin(parsed.data.videoId, admin.id, parsed.data.reason);
    } else {
      video = await hideVideoAsAdmin(parsed.data.videoId);
    }

    const hostel = await findSeedHostelByAnyId(video.hostel_id);
    const destination = hostel
      ? seedDestinations.find((d) => d.id === hostel.destination_id)
      : null;

    revalidatePath("/");
    revalidatePath("/search");
    if (hostel?.slug) revalidatePath(`/hostel/${hostel.slug}`);
    if (destination?.slug) revalidatePath(`/destination/${destination.slug}`);

    return NextResponse.json({ video });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Moderation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/** Keep legacy route working for authenticated admins only. */
export async function PUT(request: Request) {
  return POST(request);
}
