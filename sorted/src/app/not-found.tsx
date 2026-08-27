import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-4xl tracking-tight">Nothing here.</h1>
      <p className="mt-3 text-muted">That page isn&apos;t part of Sorted.</p>
      <ButtonLink href="/" className="mt-8">
        Back to dinner
      </ButtonLink>
    </div>
  );
}
