#!/usr/bin/env node
/**
 * Dev helper: approve a pending Looksee by video id.
 * Usage: npm run approve-video -- <video-id>
 */
const videoId = process.argv[2];
if (!videoId) {
  console.error("Usage: npm run approve-video -- <video-id>");
  process.exit(1);
}

const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

fetch(`${base}/api/dev/approve-video`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ videoId }),
})
  .then(async (res) => {
    const data = await res.json();
    if (!res.ok) {
      console.error(data.error || res.statusText);
      process.exit(1);
    }
    console.log("Approved:", data.video.id, data.video.status);
  })
  .catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
