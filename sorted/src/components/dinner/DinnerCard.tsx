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
  href,
  action,
  featured = false,
}: {
  restaurant: Pick<Restaurant, "name" | "suburb">;
  bundle: Pick<
    DinnerBundle,
    "name" | "description" | "price" | "feeds_people" | "estimated_minutes" | "image_url" | "tags"
  >;
  reason?: string;
  href?: string;
  action?: ReactNode;
  featured?: boolean;
}) {
  const content = (
    <article
      className={cn(
        "overflow-hidden rounded-3xl border border-border bg-card shadow-[0_10px_40px_rgba(26,21,16,0.05)]",
        featured && "lg:grid lg:grid-cols-[1.1fr_1fr]",
      )}
    >
      <div className={cn("relative bg-muted-bg", featured ? "aspect-[5/4] lg:aspect-auto lg:min-h-full" : "aspect-[16/10]")}>
        <Image
          src={bundle.image_url}
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 360px, 100vw"
        />
      </div>
      <div className="p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          {restaurant.name}
        </p>
        <h3 className="mt-2 font-display text-2xl tracking-tight">{bundle.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{bundle.description}</p>
        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
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
          <ul className="mt-4 flex flex-wrap gap-2">
            {bundle.tags.slice(0, 3).map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-muted-bg px-3 py-1 text-xs font-medium capitalize text-ink-soft"
              >
                {tag.replace("-", " ")}
              </li>
            ))}
          </ul>
        ) : null}
        {reason ? (
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Why we picked it
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{reason}</p>
          </div>
        ) : null}
        {action ? <div className="mt-5">{action}</div> : null}
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
