"use client";

import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { HouseholdProvider } from "@/components/providers/HouseholdProvider";
import { FavouritesProvider } from "@/components/providers/FavouritesProvider";
import { PrototypeNotice } from "@/components/brand/PrototypeNotice";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/" || pathname.startsWith("/how-it-works");
  const hideNav = isAdmin || pathname === "/login" || isHome;

  return (
    <HouseholdProvider>
      <FavouritesProvider>
        {isAdmin ? null : <Header />}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-card focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <main id="content" className={hideNav ? "min-h-full" : "pb-nav min-h-full"}>
          {children}
          {hideNav || isAdmin ? null : (
            <div className="mx-auto max-w-6xl px-4 pb-2 pt-8 sm:px-6">
              <PrototypeNotice />
            </div>
          )}
        </main>
        {hideNav ? null : <MobileNav />}
      </FavouritesProvider>
    </HouseholdProvider>
  );
}
