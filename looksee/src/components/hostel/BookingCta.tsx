"use client";

import { ExternalLink } from "lucide-react";
import { track } from "@/lib/analytics/posthog";

type Props = {
  hostelId: string;
  hostelName: string;
  destination: string;
  bookingUrl: string | null;
};

export function BookingCta({ hostelId, hostelName, destination, bookingUrl }: Props) {
  const href = bookingUrl ?? "https://www.hostelworld.com/";
  const provider = href.includes("hostelworld")
    ? "hostelworld"
    : href.includes("booking.com")
      ? "booking"
      : "direct";

  return (
    <div className="fixed inset-x-0 bottom-[calc(var(--nav-height)+var(--safe-bottom))] z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-md lg:bottom-0">
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{hostelName}</p>
          <p className="text-[11px] text-muted">Leaves looksee to check availability</p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            track("booking_cta_clicked", {
              hostel_id: hostelId,
              destination,
              booking_provider: provider,
            })
          }
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-white transition hover:bg-accent-hover"
        >
          Check availability
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
