import { NextResponse } from "next/server";
import { searchHostelsForUpload } from "@/lib/db/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const results = await searchHostelsForUpload(q);
  return NextResponse.json({ results });
}
