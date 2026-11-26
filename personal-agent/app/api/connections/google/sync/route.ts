import { NextResponse } from "next/server";
import { getSessionUser } from "@/src/server/auth";
import { syncAllGoogle } from "@/src/connectors/google-sync";

export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  }
  const result = await syncAllGoogle(user.userId);
  return NextResponse.json(result);
}
