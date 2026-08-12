import Mux from "@mux/mux-node";

export type MuxDirectUpload = {
  uploadId: string;
  uploadUrl: string;
};

function requireMuxCredentials() {
  const tokenId = process.env.MUX_TOKEN_ID?.trim();
  const tokenSecret = process.env.MUX_TOKEN_SECRET?.trim();

  if (!tokenId || !tokenSecret) {
    throw new Error(
      "Mux is not configured. Set MUX_TOKEN_ID and MUX_TOKEN_SECRET in .env.local.",
    );
  }

  return { tokenId, tokenSecret };
}

export function getMuxClient(): Mux {
  const { tokenId, tokenSecret } = requireMuxCredentials();
  return new Mux({ tokenId, tokenSecret });
}

export function isMuxConfigured(): boolean {
  const tokenId = process.env.MUX_TOKEN_ID?.trim();
  const tokenSecret = process.env.MUX_TOKEN_SECRET?.trim();
  return Boolean(tokenId && tokenSecret);
}

/** Safe diagnostics for production health checks — never exposes secret values. */
export function getMuxConfigStatus() {
  const tokenId = process.env.MUX_TOKEN_ID?.trim() ?? "";
  const tokenSecret = process.env.MUX_TOKEN_SECRET?.trim() ?? "";
  const webhookSecret = process.env.MUX_WEBHOOK_SECRET?.trim() ?? "";

  return {
    configured: Boolean(tokenId && tokenSecret),
    tokenIdPresent: Boolean(tokenId),
    tokenSecretPresent: Boolean(tokenSecret),
    webhookSecretPresent: Boolean(webhookSecret),
    tokenIdLooksLikeSecret: tokenId.startsWith("sk_"),
    tokenSecretLooksLikeSecret: tokenSecret.startsWith("sk_"),
    webhookSecretLooksLikeUrl: /^https?:\/\//i.test(webhookSecret),
  };
}

export async function createDirectUpload(options: {
  videoId: string;
  corsOrigin: string;
}): Promise<MuxDirectUpload> {
  const mux = getMuxClient();

  const upload = await mux.video.uploads.create({
    cors_origin: options.corsOrigin,
    new_asset_settings: {
      playback_policies: ["public"],
      passthrough: options.videoId,
    },
  });

  if (!upload.url) {
    throw new Error("Mux did not return an upload URL. Check your Mux credentials.");
  }

  return {
    uploadId: upload.id,
    uploadUrl: upload.url,
  };
}

export function playbackUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

export function thumbnailUrl(playbackId: string, time = 1): string {
  return `https://image.mux.com/${playbackId}/thumbnail.webp?time=${time}`;
}

export function verifyMuxWebhook(
  rawBody: string,
  headers: Record<string, string | string[] | undefined>,
): Promise<unknown> {
  const mux = getMuxClient();
  return mux.webhooks.unwrap(rawBody, headers);
}
