import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/constants";
import { getAdminPassword } from "@/lib/env";

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };
  if (password !== getAdminPassword()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
