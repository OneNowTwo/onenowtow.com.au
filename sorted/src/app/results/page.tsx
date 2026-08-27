import { Suspense } from "react";
import { ResultsView } from "@/components/results/ResultsView";

export const metadata = {
  title: "Tonight's options",
};

export default function ResultsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
        Three options. That&apos;s it.
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
        Tonight, we&apos;d pick one of these.
      </h1>
      <div className="mt-10">
        <Suspense>
          <ResultsView />
        </Suspense>
      </div>
    </div>
  );
}
