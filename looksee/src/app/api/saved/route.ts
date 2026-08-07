import { NextResponse } from "next/server";
import { AuthError, requireUser } from "@/lib/auth/session";
import { isHostelSaved, saveHostel, unsaveHostel } from "@/lib/db/engagement";
import { saveHostelSchema } from "@/lib/validation/mvp";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body: unknown = await request.json();
    const parsed = saveHostelSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid hostel" }, { status: 400 });
    }

    const saved = await isHostelSaved(user.id, parsed.data.hostelId);
    if (saved) {
      await unsaveHostel(user.id, parsed.data.hostelId);
      return NextResponse.json({ saved: false });
    }
    await saveHostel(user.id, parsed.data.hostelId);
    return NextResponse.json({ saved: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Could not update saved hostel";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
