"use client";

import { ButtonLink } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { useHousehold } from "@/components/providers/HouseholdProvider";

function sortHref(ready: boolean, hasHousehold: boolean) {
  return ready && hasHousehold ? "/sort" : "/household";
}

export function LandingCtas() {
  const { household, ready } = useHousehold();
  const href = sortHref(ready, Boolean(household));

  return (
    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
      <ButtonLink
        href={href}
        size="lg"
        onClick={() => track("landing_cta_clicked", { source: "hero" })}
      >
        Sort tonight&apos;s dinner
      </ButtonLink>
      <ButtonLink href="#how-it-works" variant="secondary" size="lg">
        How it works
      </ButtonLink>
    </div>
  );
}

export function LandingFooterCta() {
  const { household, ready } = useHousehold();
  const href = sortHref(ready, Boolean(household));

  return (
    <ButtonLink
      href={href}
      size="lg"
      className="bg-background text-foreground hover:bg-background/90"
      onClick={() => track("landing_cta_clicked", { source: "footer" })}
    >
      Sort dinner
    </ButtonLink>
  );
}
