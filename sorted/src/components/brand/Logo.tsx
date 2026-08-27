import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link href={href} className={cn("font-display text-2xl tracking-tight", className)}>
      Sorted
    </Link>
  );
}
