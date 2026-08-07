import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { listUploadedVideos } from "@/lib/db/videos";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import { AdminPendingVideos } from "@/components/admin/AdminPendingVideos";
import { AdminReports } from "@/components/admin/AdminReports";
import { AdminHostels } from "@/components/admin/AdminHostels";
import { AdminSuggestions } from "@/components/admin/AdminSuggestions";
import { seedDestinations, seedHostelsWithCounts } from "@/lib/seed/data";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ section?: string }> };

export default async function AdminPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");
  if (user.profile?.role !== "admin") notFound();

  const section = (await searchParams).section ?? "overview";
  const videos = await listUploadedVideos();
  const pending = videos.filter((v) => v.status === "pending" || v.status === "ready");
  const approved = videos.filter((v) => v.status === "approved");

  let travellers = 0;
  let openReports = 0;
  let reports: Array<Record<string, unknown>> = [];
  let suggestions: Array<Record<string, unknown>> = [];
  let hostels = seedHostelsWithCounts;
  let destinations = seedDestinations;

  if (isSupabaseConfigured()) {
    const admin = createAdminClient();
    const [{ count: profileCount }, reportsRes, suggestionsRes, hostelsRes, destRes] =
      await Promise.all([
        admin.from("profiles").select("id", { count: "exact", head: true }),
        admin
          .from("video_reports")
          .select("*, videos(id, mux_playback_id, category, hostel_id), profiles:reporter_id(first_name)")
          .eq("status", "open")
          .order("created_at", { ascending: false }),
        admin
          .from("hostel_suggestions")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false }),
        admin.from("hostels").select("*").order("name"),
        admin.from("destinations").select("*").order("name"),
      ]);
    travellers = profileCount ?? 0;
    reports = (reportsRes.data ?? []) as Array<Record<string, unknown>>;
    openReports = reports.length;
    suggestions = (suggestionsRes.data ?? []) as Array<Record<string, unknown>>;
    if (hostelsRes.data?.length) hostels = hostelsRes.data as typeof hostels;
    if (destRes.data?.length) destinations = destRes.data as typeof destinations;
  }

  const sections = [
    ["overview", "Overview"],
    ["pending", "Pending videos"],
    ["reports", "Reports"],
    ["hostels", "Hostels"],
    ["suggestions", "Suggestions"],
  ] as const;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Admin</p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Moderation</h1>

      <div className="scrollbar-none mt-6 flex gap-2 overflow-x-auto">
        {sections.map(([key, label]) => (
          <Link
            key={key}
            href={`/admin?section=${key}`}
            className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold ${
              section === key ? "bg-foreground text-white" : "bg-muted-bg"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        {section === "overview" ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ["Pending videos", pending.length],
              ["Approved videos", approved.length],
              ["Travellers", travellers],
              ["Open reports", openReports],
              ["Total videos", videos.length],
              ["Hostels", hostels.length],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl bg-card p-4 ring-1 ring-border">
                <p className="text-2xl font-extrabold tabular-nums">{value}</p>
                <p className="text-xs text-muted">{label}</p>
              </div>
            ))}
          </div>
        ) : null}

        {section === "pending" ? <AdminPendingVideos videos={pending} /> : null}
        {section === "reports" ? <AdminReports reports={reports} /> : null}
        {section === "hostels" ? (
          <AdminHostels hostels={hostels} destinations={destinations} />
        ) : null}
        {section === "suggestions" ? <AdminSuggestions suggestions={suggestions} /> : null}
      </div>
    </div>
  );
}
