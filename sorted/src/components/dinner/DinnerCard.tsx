import type { ReactNode } from "react";
import Link from "next/link";
import { FoodImage } from "@/components/dinner/FoodImage";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { DinnerBundle, Restaurant } from "@/lib/types";

export function DinnerCard({
  restaurant,
  bundle,
  reason,
  reasonHeading = "Why we picked it",
  href,
  action,
  variant = "default",
  eyebrow,
}: {
  restaurant: Pick<Restaurant, "name" | "suburb" | "cuisine">;
  bundle: Pick<
    DinnerBundle,
    "name" | "description" | "price" | "feeds_people" | "estimated_minutes" | "image_url" | "tags"
  >;
  reason?: string;
  reasonHeading?: string;
  href?: string;
  action?: ReactNode;
  variant?: "default" | "featured" | "compact" | "showcase";
  eyebrow?: string;
}) {
  const compact = variant === "compact";
  const featured = variant === "featured";
  const showcase = variant === "showcase";

  const content = (
    <article
      className={cn(
        "overflow-hidden rounded-3xl border border-border bg-card",
        href && "transition hover:border-foreground/25",
        featured && "md:grid md:grid-cols-[1.15fr_1fr]",
        compact && "grid grid-cols-[7.5rem_1fr] sm:grid-cols-[9.5rem_1fr]",
      )}
    >
      <div
        className={cn(
          "relative bg-muted-bg",
          compact && "min-h-full",
          featured && "aspect-[4/3] md:aspect-auto md:min-h-[22rem]",
          showcase && "aspect-[4/3] sm:aspect-[5/4]",
          variant === "default" && "aspect-[16/10]",
        )}
      >
        <FoodImage
          src={bundle.image_url}
          alt=""
          sizes={
            featured
              ? "(min-width: 768px) 520px, 100vw"
              : compact
                ? "160px"
                : "(min-width: 1024px) 380px, 100vw"
          }
          priority={featured || showcase}
        />
      </div>
      <div className={cn("p-5 sm:p-6", compact && "p-4 sm:p-5")}>
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
        ) : null}
        <h3
          className={cn(
            "font-display tracking-tight",
            eyebrow ? "mt-2" : "mt-0",
            featured ? "text-3xl sm:text-[2.15rem]" : compact ? "text-xl" : "text-2xl",
          )}
        >
          {bundle.name}
        </h3>
        <p className="mt-2 text-sm font-semibold text-ink-soft">
          {restaurant.name}
          {restaurant.suburb ? ` · ${restaurant.suburb}` : ""}
        </p>
        {restaurant.cuisine && !compact ? (
          <p className="mt-0.5 text-xs text-muted">{restaurant.cuisine}</p>
        ) : null}
        {compact ? null : (
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{bundle.description}</p>
        )}
        <p className="mt-3 text-sm text-muted">
          {formatPrice(bundle.price)}
          <span aria-hidden className="mx-2">
            ·
          </span>
          feeds {bundle.feeds_people}
          <span aria-hidden className="mx-2">
            ·
          </span>
          approx. {bundle.estimated_minutes} mins
        </p>
        {bundle.tags.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {bundle.tags.slice(0, compact ? 2 : 3).map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-muted-bg px-3 py-1 text-xs font-medium capitalize text-ink-soft"
              >
                {tag.replace("-", " ")}
              </li>
            ))}
          </ul>
        ) : null}
        {reason && !compact ? (
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {reasonHeading}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{reason}</p>
          </div>
        ) : null}
        {action ? <div className={cn("mt-5", compact && "mt-4")}>{action}</div> : null}
      </div>
    </article>
  );

  if (!href) return content;
  return (
    <Link href={href} className="block cursor-pointer rounded-3xl transition hover:-translate-y-0.5">
      {content}
    </Link>
  );
}
