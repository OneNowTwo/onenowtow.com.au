"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TonightLink } from "@/components/TonightLink";
import { cn } from "@/lib/cn";

const items = [
  { href: "/sort", label: "Tonight" },
  { href: "/week", label: "My Week" },
  { href: "/favourites", label: "Favourites" },
  { href: "/profile", label: "You" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "var(--safe-bottom)" }}
      aria-label="Primary"
    >
      <ul className="mx-auto grid h-[var(--nav-height)] max-w-lg grid-cols-4 items-center px-2">
        {items.map((item) => {
          const active =
            item.href === "/sort"
              ? pathname.startsWith("/sort") ||
                pathname.startsWith("/results") ||
                pathname.startsWith("/dinner") ||
                pathname.startsWith("/household")
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const className = cn(
            "flex min-h-12 min-w-16 cursor-pointer flex-col items-center justify-center rounded-xl px-2 text-[11px] font-semibold tracking-wide uppercase transition hover:text-foreground",
            active ? "text-accent" : "text-muted",
          );
          return (
            <li key={item.href} className="flex justify-center">
              {item.href === "/sort" ? (
                <TonightLink className={className}>{item.label}</TonightLink>
              ) : (
                <Link href={item.href} className={className}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
