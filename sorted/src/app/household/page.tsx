import { Suspense } from "react";
import { HouseholdForm } from "@/components/household/HouseholdForm";

export const metadata = {
  title: "Household",
};

export default function HouseholdPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Household</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
        Let&apos;s get to know your household.
      </h1>
      <p className="mt-4 max-w-lg text-muted leading-relaxed">
        A little context means we can stop asking the same questions every night.
      </p>
      <div className="mt-10">
        <Suspense>
          <HouseholdForm />
        </Suspense>
      </div>
    </div>
  );
}
