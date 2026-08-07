import { NextResponse } from "next/server";
import { AuthError, requireUser } from "@/lib/auth/session";
import { createHostelSuggestion } from "@/lib/db/videos";
import { suggestHostelSchema } from "@/lib/validation/mvp";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body: unknown = await request.json();
    const parsed = suggestHostelSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid suggestion" },
        { status: 400 },
      );
    }

    const suggestion = await createHostelSuggestion({
      userId: user.id,
      ...parsed.data,
    });
    return NextResponse.json({ suggestion });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message =
      error instanceof Error ? error.message : "Could not save hostel suggestion.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
