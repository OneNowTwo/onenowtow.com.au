import { NextResponse } from "next/server";
import { AuthError, requireUser } from "@/lib/auth/session";
import { toggleHelpful } from "@/lib/db/engagement";
import { helpfulSchema } from "@/lib/validation/mvp";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body: unknown = await request.json();
    const parsed = helpfulSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid video" }, { status: 400 });
    }
    const result = await toggleHelpful(user.id, parsed.data.videoId);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Could not update Helpful vote";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
