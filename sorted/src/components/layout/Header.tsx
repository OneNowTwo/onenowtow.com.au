"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const links = [
  { href: "/sort", label: "Tonight" },
  { href: "/week", label: "My Week" },
  { href: "/favourites", label: "Favourites" },
  { href: "/profile", label: "Profile" },
];

export function Header() {
  const pathname = usePathname();
  const hideCta = pathname.startsWith("/sort") || pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-soft lg:flex" aria-label="Primary">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition hover:text-foreground",
                  active && "text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        {!hideCta ? (
          <ButtonLink href="/sort" size="sm" className="hidden lg:inline-flex">
            Sort dinner
          </ButtonLink>
        ) : (
          <span className="hidden lg:block" />
        )}
      </div>
    </header>
  );
}
