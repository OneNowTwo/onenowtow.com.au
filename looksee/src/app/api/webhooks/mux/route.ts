import { NextResponse } from "next/server";
import { applyWebhookUpdate } from "@/lib/db/videos";
import { verifyMuxWebhook } from "@/lib/mux/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MuxWebhookEvent = {
  type?: string;
  data?: {
    id?: string;
    upload_id?: string;
    asset_id?: string;
    passthrough?: string;
    playback_ids?: Array<{ id?: string; policy?: string }>;
    errors?: { messages?: string[] };
    new_asset_settings?: { passthrough?: string };
  };
};

function headerMap(request: Request): Record<string, string> {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return headers;
}

function pickPlaybackId(
  playbackIds: Array<{ id?: string; policy?: string }> | undefined,
): string | null {
  return (
    playbackIds?.find((p) => p.policy === "public")?.id ?? playbackIds?.[0]?.id ?? null
  );
}

async function handleMuxEvent(event: MuxWebhookEvent): Promise<void> {
  const type = event.type ?? "";
  const data = event.data ?? {};

  if (type === "video.upload.asset_created") {
    await applyWebhookUpdate({
      videoId: data.new_asset_settings?.passthrough ?? data.passthrough ?? null,
      muxUploadId: data.id ?? data.upload_id ?? null,
      muxAssetId: data.asset_id ?? null,
      status: "processing",
    });
    return;
  }

  if (type === "video.asset.created") {
    await applyWebhookUpdate({
      videoId: data.passthrough ?? null,
      muxAssetId: data.id ?? null,
      status: "processing",
    });
    return;
  }

  if (type === "video.asset.ready") {
    await applyWebhookUpdate({
      videoId: data.passthrough ?? null,
      muxAssetId: data.id ?? null,
      muxPlaybackId: pickPlaybackId(data.playback_ids),
      status: "ready",
    });
    return;
  }

  if (type === "video.asset.errored") {
    await applyWebhookUpdate({
      videoId: data.passthrough ?? null,
      muxAssetId: data.id ?? null,
      status: "errored",
      errorMessage: data.errors?.messages?.join("; ") ?? "Mux could not process this video.",
    });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "/api/webhooks/mux",
    webhookSecretConfigured: Boolean(process.env.MUX_WEBHOOK_SECRET),
  });
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  try {
    let event: MuxWebhookEvent;

    if (process.env.MUX_WEBHOOK_SECRET) {
      event = (await verifyMuxWebhook(rawBody, headerMap(request))) as MuxWebhookEvent;
    } else if (process.env.NODE_ENV === "development") {
      console.warn(
        "[mux webhook] MUX_WEBHOOK_SECRET missing — accepting unsigned payload in development only",
      );
      event = JSON.parse(rawBody) as MuxWebhookEvent;
    } else {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const type = event.type ?? "unknown";
    await handleMuxEvent(event);
    console.info("[mux webhook] handled", type);

    return NextResponse.json({ ok: true, type });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Mux webhook";
    console.error("[mux webhook]", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
