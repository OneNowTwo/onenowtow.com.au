import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatMinutes, formatPrice } from "@/lib/format";
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
  restaurant: Pick<Restaurant, "name" | "suburb">;
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
        <Image
          src={bundle.image_url}
          alt={bundle.name}
          fill
          className="object-cover"
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
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.18em] text-muted",
            eyebrow && "mt-2",
          )}
        >
          {restaurant.name}
        </p>
        <h3
          className={cn(
            "mt-2 font-display tracking-tight",
            featured ? "text-3xl sm:text-[2.15rem]" : compact ? "text-xl" : "text-2xl",
          )}
        >
          {bundle.name}
        </h3>
        {compact ? null : (
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{bundle.description}</p>
        )}
        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <div>
            <dt className="sr-only">Feeds</dt>
            <dd>Feeds {bundle.feeds_people}</dd>
          </div>
          <div>
            <dt className="sr-only">Price</dt>
            <dd>{formatPrice(bundle.price)}</dd>
          </div>
          <div>
            <dt className="sr-only">Time</dt>
            <dd>{formatMinutes(bundle.estimated_minutes)}</dd>
          </div>
        </dl>
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
    <Link href={href} className="block transition hover:-translate-y-0.5">
      {content}
    </Link>
  );
}
