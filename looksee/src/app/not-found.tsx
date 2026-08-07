import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <Logo />
      <h1 className="mt-8 text-2xl font-extrabold tracking-tight">Page not found</h1>
      <p className="mt-2 text-sm text-muted">
        That destination or hostel isn&apos;t here — try searching instead.
      </p>
      <Link
        href="/search"
        className="mt-6 inline-flex h-11 items-center rounded-xl bg-accent px-4 text-sm font-bold text-white hover:bg-accent-hover"
      >
        Search hostels
      </Link>
    </div>
  );
}
