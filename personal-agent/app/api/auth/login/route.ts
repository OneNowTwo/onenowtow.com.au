import { NextResponse } from "next/server";
import { loginPilot } from "@/src/server/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string };
  if (!body.email) {
    return NextResponse.json({ error: "email_required" }, { status: 400 });
  }
  try {
    const user = await loginPilot(body.email);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "login_failed" },
      { status: 403 },
    );
  }
}
