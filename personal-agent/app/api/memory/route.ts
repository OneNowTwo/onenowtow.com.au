import { NextResponse } from "next/server";
import { getSessionUser } from "@/src/server/auth";
import {
  deleteFact,
  listFacts,
  listPreferences,
  upsertFact,
} from "@/src/server/store";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const [facts, preferences] = await Promise.all([
    listFacts(user.userId),
    listPreferences(user.userId),
  ]);
  return NextResponse.json({ facts, preferences });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const body = (await request.json()) as {
    entity: string;
    attribute: string;
    value: string;
  };
  const id = await upsertFact(user.userId, body);
  return NextResponse.json({ id });
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id_required" }, { status: 400 });
  await deleteFact(user.userId, id);
  return NextResponse.json({ ok: true });
}
