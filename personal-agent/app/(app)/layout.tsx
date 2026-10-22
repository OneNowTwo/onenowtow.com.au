import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { getSessionUser } from "@/src/server/auth";
import { ensurePilotUser } from "@/src/server/store";

export default async function AppLayout({ children }: { readonly children: ReactNode }) {
  await ensurePilotUser();
  const user = await getSessionUser();
  return <AppShell userLabel={user?.displayName}>{children}</AppShell>;
}
