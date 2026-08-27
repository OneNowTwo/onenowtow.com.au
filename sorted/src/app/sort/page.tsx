import { SortForm } from "@/components/sort/SortForm";

export const metadata = {
  title: "Tonight",
};

export default function SortPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Tonight</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
        What are we eating tonight?
      </h1>
      <div className="mt-8">
        <SortForm />
      </div>
    </div>
  );
}
