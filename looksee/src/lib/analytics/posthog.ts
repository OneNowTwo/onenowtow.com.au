/**
 * PostHog analytics abstraction.
 */

export type AnalyticsEvent =
  | "homepage_viewed"
  | "destination_viewed"
  | "hostel_viewed"
  | "video_started"
  | "video_25_percent"
  | "video_50_percent"
  | "video_completed"
  | "helpful_clicked"
  | "helpful_removed"
  | "hostel_saved"
  | "hostel_unsaved"
  | "upload_page_viewed"
  | "upload_hostel_selected"
  | "upload_category_selected"
  | "upload_video_selected"
  | "upload_started"
  | "upload_failed"
  | "upload_completed"
  | "video_processing_started"
  | "video_processing_completed"
  | "video_submitted"
  | "booking_cta_clicked"
  | "signup_started"
  | "signup_completed"
  | "login_completed"
  | "search_performed";

type EventProps = Record<string, string | number | boolean | null | undefined>;

let posthogLoaded = false;

async function getPosthog() {
  if (typeof window === "undefined") return null;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;

  const posthog = (await import("posthog-js")).default;
  if (!posthogLoaded) {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: false,
      persistence: "localStorage",
    });
    posthogLoaded = true;
  }
  return posthog;
}

export function track(event: AnalyticsEvent, properties?: EventProps): void {
  if (typeof window === "undefined") return;

  const safe = { ...(properties ?? {}) };
  // Never send PII
  delete safe.email;
  delete safe.caption;
  delete safe.full_name;
  delete safe.name;

  void getPosthog().then((posthog) => {
    if (posthog) {
      posthog.capture(event, safe);
      return;
    }
    if (process.env.NODE_ENV === "development") {
      console.debug(`[analytics] ${event}`, safe);
    }
  });
}
