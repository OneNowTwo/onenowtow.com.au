/** Only allow same-origin relative paths (blocks open redirects). */
export function safeNextPath(next: string | null | undefined, fallback = "/profile"): string {
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//")) return fallback;
  return next;
}
