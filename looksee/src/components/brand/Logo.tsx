import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type LogoProps = {
  className?: string;
  href?: string;
};

export function Logo({ className, href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-baseline gap-0 text-[1.35rem] font-extrabold tracking-tight text-foreground",
        className,
      )}
      aria-label="looksee home"
    >
      look<span className="text-accent">see</span>
    </Link>
  );
}
