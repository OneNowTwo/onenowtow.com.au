import { Suspense } from "react";
import { DinnerDetail } from "@/components/dinner/DinnerDetail";

export const metadata = {
  title: "Dinner",
};

export default function DinnerPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <Suspense fallback={<p className="text-muted">Loading dinner…</p>}>
        <DinnerDetail />
      </Suspense>
    </div>
  );
}
