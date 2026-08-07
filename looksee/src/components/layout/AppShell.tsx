import { DesktopNav } from "@/components/layout/DesktopNav";
import { MobileNav } from "@/components/layout/MobileNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <DesktopNav />
      <main className="flex-1 pb-nav">{children}</main>
      <MobileNav />
    </div>
  );
}
