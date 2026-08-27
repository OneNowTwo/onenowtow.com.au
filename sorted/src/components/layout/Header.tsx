"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const productLinks = [
  { href: "/sort", label: "Tonight" },
  { href: "/week", label: "My Week" },
  { href: "/favourites", label: "Favourites" },
  { href: "/profile", label: "You" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-3 sm:gap-5" aria-label="Primary">
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-ink-soft transition hover:text-foreground"
            >
              How it works
            </Link>
            <ButtonLink href="/sort" size="sm">
              Sort dinner
            </ButtonLink>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav
          className="hidden items-center gap-7 text-sm font-medium text-ink-soft md:flex"
          aria-label="Primary"
        >
          {productLinks.map((link) => {
            const active =
              link.href === "/sort"
                ? pathname.startsWith("/sort") ||
                  pathname.startsWith("/results") ||
                  pathname.startsWith("/dinner") ||
                  pathname.startsWith("/household")
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn("transition hover:text-foreground", active && "text-foreground")}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <span className="hidden md:block w-20" />
      </div>
    </header>
  );
}
