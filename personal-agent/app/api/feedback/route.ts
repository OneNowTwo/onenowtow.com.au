import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getSessionUser } from "@/src/server/auth";
import { applyFeedbackCommand } from "@/src/server/store";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const body = (await request.json()) as {
    text: string;
    idempotencyKey?: string;
    topicHint?: string;
    suggestionId?: string;
  };
  if (!body.text?.trim()) {
    return NextResponse.json({ error: "text_required" }, { status: 400 });
  }
  const result = await applyFeedbackCommand({
    userId: user.userId,
    text: body.text,
    idempotencyKey: body.idempotencyKey ?? randomUUID(),
    topicHint: body.topicHint,
    suggestionId: body.suggestionId,
  });
  return NextResponse.json(result);
}
