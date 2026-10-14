import { NextResponse } from "next/server";
import { getSessionUser } from "@/src/server/auth";
import {
  getControls,
  pauseUser,
  resumeUser,
  updateControls,
} from "@/src/server/store";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  return NextResponse.json({ controls: await getControls(user.userId) });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const body = (await request.json()) as {
    action?: "pause" | "resume" | "update";
    until?: string | null;
    patch?: Record<string, unknown>;
  };

  if (body.action === "pause") {
    return NextResponse.json({
      controls: await pauseUser(user.userId, body.until ?? null),
    });
  }
  if (body.action === "resume") {
    return NextResponse.json({ controls: await resumeUser(user.userId) });
  }
  if (body.action === "update" && body.patch) {
    return NextResponse.json({
      controls: await updateControls(user.userId, body.patch as never),
    });
  }
  return NextResponse.json({ error: "invalid_action" }, { status: 400 });
}
