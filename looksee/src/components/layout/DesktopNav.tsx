"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { AuthNavLink } from "@/components/auth/AuthNavLink";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/", label: "Explore" },
  { href: "/search", label: "Search" },
  { href: "/upload", label: "Upload" },
  { href: "/points", label: "Points" },
  { href: "/saved", label: "Saved" },
] as const;

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 hidden border-b border-border bg-card/90 backdrop-blur-md lg:block">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <nav className="flex items-center gap-1" aria-label="Primary">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:bg-muted-bg hover:text-foreground",
                  link.href === "/upload" && !active && "text-accent",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <AuthNavLink
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-semibold transition",
              pathname.startsWith("/login") || pathname.startsWith("/profile")
                ? "bg-accent-soft text-accent"
                : "text-foreground hover:bg-muted-bg",
            )}
          />
        </nav>
      </div>
    </header>
  );
}
