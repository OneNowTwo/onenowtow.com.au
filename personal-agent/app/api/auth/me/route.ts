import { NextResponse } from "next/server";
import { getSessionUser } from "@/src/server/auth";
import { ensurePilotUser } from "@/src/server/store";

export async function GET() {
  await ensurePilotUser();
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user });
}
