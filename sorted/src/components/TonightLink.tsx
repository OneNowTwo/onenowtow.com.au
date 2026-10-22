"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession } from "@/lib/storage";

type TonightLinkProps = {
  className?: string;
  children: React.ReactNode;
  onNavigate?: () => void;
};

/** Always returns the user to a fresh Tonight screen (household prefs stay). */
export function TonightLink({ className, children, onNavigate }: TonightLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Link
      href="/sort?new=1"
      className={className}
      onClick={(event) => {
        onNavigate?.();
        clearSession();
        if (pathname.startsWith("/sort")) {
          event.preventDefault();
          router.push(`/sort?new=${Date.now()}`);
        }
      }}
    >
      {children}
    </Link>
  );
}
