"use client";

import { useEffect, useRef } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics/posthog";

type Props = {
  event: AnalyticsEvent;
  properties?: Record<string, string | number | boolean | null | undefined>;
};

export function PageAnalytics({ event, properties }: Props) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    track(event, properties);
  }, [event, properties]);

  return null;
}

export function HomepageAnalytics() {
  return <PageAnalytics event="homepage_viewed" />;
}
