import { NextResponse } from "next/server";
import { AuthError, requireUser, updateOwnProfile } from "@/lib/auth/session";
import { profileUpdateSchema } from "@/lib/validation/mvp";

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();
    const body: unknown = await request.json();
    const parsed = profileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid profile" },
        { status: 400 },
      );
    }
    const profile = await updateOwnProfile(user.id, parsed.data);
    return NextResponse.json({ profile });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Could not update profile";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
