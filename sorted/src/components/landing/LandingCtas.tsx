"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { useHousehold } from "@/components/providers/HouseholdProvider";

export function LandingCtas() {
  const router = useRouter();
  const { household, ready } = useHousehold();

  function start() {
    track("landing_cta_clicked", { source: "hero" });
    router.push(ready && household ? "/sort" : "/household");
  }

  return (
    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
      <Button size="lg" onClick={start}>
        Sort tonight&apos;s dinner
      </Button>
      <ButtonLink href="#how-it-works" variant="secondary" size="lg">
        How it works
      </ButtonLink>
    </div>
  );
}

export function LandingFooterCta() {
  const router = useRouter();
  const { household, ready } = useHousehold();

  function start() {
    track("landing_cta_clicked", { source: "footer" });
    router.push(ready && household ? "/sort" : "/household");
  }

  return (
    <Button size="lg" onClick={start}>
      Sort dinner
    </Button>
  );
}
