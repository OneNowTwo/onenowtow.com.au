"use client";

import { cn } from "@/lib/cn";
import { useFavourites } from "@/components/providers/FavouritesProvider";

export function FavouriteButton({
  bundleId,
  variant = "compact",
  className,
}: {
  bundleId: string;
  variant?: "compact" | "full";
  className?: string;
}) {
  const { isSaved, toggle } = useFavourites();
  const saved = isSaved(bundleId);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(bundleId);
      }}
      className={cn(
        "cursor-pointer rounded-full border px-3 py-1.5 text-sm font-semibold transition",
        saved
          ? "border-accent bg-accent-soft text-accent"
          : "border-border bg-card text-ink-soft hover:border-foreground/40",
        className,
      )}
      aria-pressed={saved}
    >
      {saved ? "♥ Saved" : variant === "full" ? "♡ Save to favourites" : "♡ Save"}
    </button>
  );
}
