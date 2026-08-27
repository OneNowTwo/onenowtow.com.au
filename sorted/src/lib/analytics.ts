export type AnalyticsEventName =
  | "landing_cta_clicked"
  | "household_created"
  | "sort_started"
  | "recommendations_viewed"
  | "recommendation_refreshed"
  | "dinner_selected"
  | "order_clicked"
  | "favourite_saved"
  | "weekly_plan_viewed"
  | "sorted_3_waitlist_joined";

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  properties?: Record<string, unknown>;
  timestamp: string;
}

type AnalyticsSink = (event: AnalyticsEvent) => void;

const sinks: AnalyticsSink[] = [
  (event) => {
    if (process.env.NODE_ENV !== "test") {
      console.info("[sorted:analytics]", event.name, event.properties ?? {});
    }
  },
];

export function registerAnalyticsSink(sink: AnalyticsSink): void {
  sinks.push(sink);
}

export function track(
  name: AnalyticsEventName,
  properties?: Record<string, unknown>,
): void {
  const event: AnalyticsEvent = {
    name,
    properties,
    timestamp: new Date().toISOString(),
  };
  for (const sink of sinks) {
    try {
      sink(event);
    } catch (error) {
      console.warn("[sorted:analytics] sink failed", error);
    }
  }
}

/** Placeholder for a later PostHog (or similar) sink. */
export function initExternalAnalytics(): void {
  // Intentionally empty in v0.1. Call registerAnalyticsSink() from a provider.
}
