import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";

export function EmptyState({
  title,
  body,
  actionHref,
  actionLabel,
  secondary,
}: {
  title: string;
  body: string;
  actionHref?: string;
  actionLabel?: string;
  secondary?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h2 className="font-display text-3xl tracking-tight">{title}</h2>
      <p className="mt-3 text-muted leading-relaxed">{body}</p>
      {actionHref && actionLabel ? (
        <ButtonLink href={actionHref} className="mt-8" size="lg">
          {actionLabel}
        </ButtonLink>
      ) : null}
      {secondary ? <div className="mt-6">{secondary}</div> : null}
    </div>
  );
}
