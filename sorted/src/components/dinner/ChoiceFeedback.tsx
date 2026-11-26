"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { STORAGE_KEYS } from "@/lib/constants";
import { readJson, writeJson } from "@/lib/storage";
import type { RecommendationFeedback } from "@/lib/types";
import { Chip } from "@/components/ui/Chip";

const NEGATIVE_REASONS = [
  "Too expensive",
  "Wrong cuisine",
  "Kids wouldn't eat it",
  "Too unhealthy",
  "Too slow",
  "Didn't feel like it",
  "Other",
];

export function ChoiceFeedback({
  bundleId,
  restaurantName,
}: {
  bundleId: string;
  restaurantName: string;
}) {
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  function persist(positive: boolean, nextReasons: string[]) {
    const record: RecommendationFeedback = {
      id: crypto.randomUUID(),
      bundleId,
      restaurantName,
      positive,
      reasons: nextReasons,
      createdAt: new Date().toISOString(),
    };
    const current = readJson<RecommendationFeedback[]>(STORAGE_KEYS.feedback, []);
    writeJson(STORAGE_KEYS.feedback, [...current, record]);
    track(positive ? "recommendation_feedback_positive" : "recommendation_feedback_negative", {
      bundleId,
      restaurantName,
      reasons: nextReasons,
    });
    setSaved(true);
  }

  if (saved) {
    return <p className="text-sm text-muted">Thanks — that helps us sort dinner better.</p>;
  }

  return (
    <div>
      <h2 className="font-display text-2xl tracking-tight">Good recommendation?</h2>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          className="cursor-pointer rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold hover:border-foreground/40"
          onClick={() => {
            setAnswer("yes");
            persist(true, []);
          }}
        >
          Yes
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold hover:border-foreground/40"
          onClick={() => setAnswer("no")}
        >
          Not really
        </button>
      </div>
      {answer === "no" ? (
        <div className="mt-5">
          <p className="text-sm text-muted">What missed the mark? Optional.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {NEGATIVE_REASONS.map((reason) => (
              <Chip
                key={reason}
                selected={reasons.includes(reason)}
                onClick={() =>
                  setReasons((current) =>
                    current.includes(reason)
                      ? current.filter((item) => item !== reason)
                      : [...current, reason],
                  )
                }
              >
                {reason}
              </Chip>
            ))}
          </div>
          <button
            type="button"
            className="mt-4 cursor-pointer text-sm font-semibold text-accent underline-offset-4 hover:underline"
            onClick={() => persist(false, reasons)}
          >
            Send feedback
          </button>
        </div>
      ) : null}
    </div>
  );
}
