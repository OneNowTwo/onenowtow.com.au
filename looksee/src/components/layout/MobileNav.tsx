"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bookmark, Compass, Search, Upload, User, LogIn } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";

const baseItems: Array<{
  href: string;
  label: string;
  icon: typeof Compass;
  prominent?: boolean;
  auth?: "always" | "signed-in" | "signed-out";
}> = [
  { href: "/", label: "Explore", icon: Compass, auth: "always" },
  { href: "/search", label: "Search", icon: Search, auth: "always" },
  { href: "/upload", label: "Upload", icon: Upload, prominent: true, auth: "always" },
  { href: "/saved", label: "Saved", icon: Bookmark, auth: "always" },
  { href: "/profile", label: "Profile", icon: User, auth: "signed-in" },
  { href: "/login", label: "Sign in", icon: LogIn, auth: "signed-out" },
];

export function MobileNav() {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    void supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const items = baseItems.filter((item) => {
    if (item.auth === "signed-in") return signedIn;
    if (item.auth === "signed-out") return !signedIn;
    return true;
  });

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "var(--safe-bottom)" }}
      aria-label="Primary"
    >
      <ul className="mx-auto grid h-[var(--nav-height)] max-w-lg grid-cols-5 items-center px-1">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          if (item.prominent) {
            return (
              <li key={item.href} className="flex justify-center">
                <Link
                  href={item.href}
                  className="flex -translate-y-3 flex-col items-center gap-0.5"
                  aria-label="Upload a Looksee"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-[0_8px_20px_rgba(232,93,4,0.35)] transition hover:bg-accent-hover">
                    <Icon className="h-6 w-6" strokeWidth={2.25} />
                  </span>
                  <span className="text-[10px] font-semibold text-accent">Upload</span>
                </Link>
              </li>
            );
          }

          return (
            <li key={item.href} className="flex justify-center">
              <Link
                href={item.href}
                className={cn(
                  "flex min-w-[3.5rem] flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium transition",
                  active ? "text-accent" : "text-muted hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
