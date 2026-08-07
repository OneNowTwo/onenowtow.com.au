import { NextResponse } from "next/server";
import { applyWebhookUpdate } from "@/lib/db/videos";
import { verifyMuxWebhook } from "@/lib/mux/client";

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

export async function POST(request: Request) {
  const rawBody = await request.text();

  try {
    let event: MuxWebhookEvent;

    if (process.env.MUX_WEBHOOK_SECRET) {
      event = verifyMuxWebhook(rawBody, headerMap(request)) as MuxWebhookEvent;
    } else if (process.env.NODE_ENV === "development") {
      console.warn("[mux webhook] MUX_WEBHOOK_SECRET missing — accepting unsigned payload in development only");
      event = JSON.parse(rawBody) as MuxWebhookEvent;
    } else {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const type = event.type ?? "";
    const data = event.data ?? {};

    if (type === "video.upload.asset_created") {
      await applyWebhookUpdate({
        videoId: data.new_asset_settings?.passthrough ?? data.passthrough ?? null,
        muxUploadId: data.id ?? data.upload_id ?? null,
        muxAssetId: data.asset_id ?? null,
        status: "processing",
      });
      return NextResponse.json({ ok: true });
    }

    if (type === "video.asset.ready") {
      const playbackId =
        data.playback_ids?.find((p) => p.policy === "public")?.id ??
        data.playback_ids?.[0]?.id ??
        null;

      await applyWebhookUpdate({
        videoId: data.passthrough ?? null,
        muxAssetId: data.id ?? null,
        muxPlaybackId: playbackId,
        status: "ready",
      });
      return NextResponse.json({ ok: true });
    }

    if (type === "video.asset.errored") {
      const message =
        data.errors?.messages?.join("; ") ?? "Mux could not process this video.";
      await applyWebhookUpdate({
        videoId: data.passthrough ?? null,
        muxAssetId: data.id ?? null,
        status: "errored",
        errorMessage: message,
      });
      return NextResponse.json({ ok: true });
    }

    // Acknowledge unknown events so Mux does not retry endlessly.
    return NextResponse.json({ ok: true, ignored: type });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Mux webhook";
    console.error("[mux webhook]", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
