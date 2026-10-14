"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Chat" },
  { href: "/today", label: "Today" },
  { href: "/memory", label: "Memory" },
  { href: "/connections", label: "Connections" },
  { href: "/controls", label: "Controls" },
];

export function AppShell({
  children,
  userLabel,
}: {
  readonly children: ReactNode;
  readonly userLabel?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="pa-shell">
      <header className="pa-header">
        <div className="pa-brand">
          <span className="pa-brand-mark">Personal Agent</span>
          <span className="pa-brand-sub">for you · work & play</span>
        </div>
        <nav className="pa-nav" aria-label="Primary">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/" || pathname.startsWith("/s/")
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("pa-nav-link", active && "pa-nav-link-active")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="pa-user">{userLabel ?? "Pilot"}</div>
      </header>
      <main className="pa-main">{children}</main>
    </div>
  );
}
