import { NextResponse } from "next/server";
import { AuthError, requireUser } from "@/lib/auth/session";
import { createReport } from "@/lib/db/engagement";
import { reportSchema } from "@/lib/validation/mvp";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body: unknown = await request.json();
    const parsed = reportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid report" },
        { status: 400 },
      );
    }
    await createReport({
      userId: user.id,
      videoId: parsed.data.videoId,
      reason: parsed.data.reason,
      details: parsed.data.details,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Could not submit report";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
