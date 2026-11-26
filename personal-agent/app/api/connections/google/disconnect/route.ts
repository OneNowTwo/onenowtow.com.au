import { NextResponse } from "next/server";
import { getSessionUser } from "@/src/server/auth";
import { disconnectGoogle } from "@/src/server/store";

export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  }
  await disconnectGoogle(user.userId);
  return NextResponse.json({ ok: true });
}
