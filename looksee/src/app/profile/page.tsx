import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { HostelCardView } from "@/components/hostel/HostelCard";
import { getSessionUser } from "@/lib/auth/session";
import { listPointsForUser, formatPointsLine } from "@/lib/db/points";
import { listSavedHostels } from "@/lib/db/engagement";
import { listVideosForUser, syncStaleMuxVideos } from "@/lib/db/videos";
import { searchHostels } from "@/lib/db/queries";
import { hostelsByAnyId } from "@/lib/db/hostels";
import { ProfileSettingsForm } from "@/components/profile/ProfileSettingsForm";
import { ProfileVideoSync } from "@/components/profile/ProfileVideoSync";
import { shortDate } from "@/lib/utils/dates";
import { CATEGORY_LABELS } from "@/lib/seed/data";
import type { VideoCategory } from "@/lib/types/database";

export const metadata: Metadata = { title: "Profile" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function ProfilePage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/profile");

  const tab = (await searchParams).tab ?? "looksees";
  const profile = user.profile;
  let videos = await listVideosForUser(user.id);
  await syncStaleMuxVideos(videos);
  videos = await listVideosForUser(user.id);
  const [points, saves, hostelLookup] = await Promise.all([
    listPointsForUser(user.id),
    listSavedHostels(user.id),
    hostelsByAnyId(),
  ]);

  const helpfulReceived = videos.reduce((sum, v) => sum + v.helpful_count, 0);
  const approvedCount = videos.filter((v) => v.status === "approved").length;

  const allHostels = await searchHostels("");
  const savedCards = saves
    .map((s) => {
      const hostel =
        allHostels.find((h) => h.id === s.hostel_id) ??
        (() => {
          const seed = hostelLookup.get(s.hostel_id);
          if (!seed) return null;
          return allHostels.find((h) => h.slug === seed.slug) ?? null;
        })();
      return hostel;
    })
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
      <ProfileVideoSync />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted-bg">
            {profile?.avatar_url ? (
              <Image src={profile.avatar_url} alt="" fill className="object-cover" sizes="64px" />
            ) : null}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              {profile?.first_name ?? "Traveller"}
            </h1>
            <p className="text-sm text-muted">{user.email}</p>
            <p className="text-sm text-muted">
              Joined {profile?.created_at ? shortDate(profile.created_at) : "recently"}
            </p>
          </div>
        </div>
        <SignOutButton />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl bg-card p-4 ring-1 ring-border">
        <div>
          <p className="text-xl font-extrabold tabular-nums">{profile?.points_balance ?? 0}</p>
          <p className="text-[11px] text-muted">Looksee Points</p>
        </div>
        <div>
          <p className="text-xl font-extrabold tabular-nums">{approvedCount}</p>
          <p className="text-[11px] text-muted">Looksees</p>
        </div>
        <div>
          <p className="text-xl font-extrabold tabular-nums">{helpfulReceived}</p>
          <p className="text-[11px] text-muted">Helped travellers</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted">Rewards coming soon</p>

      <div className="scrollbar-none mt-6 flex gap-2 overflow-x-auto">
        {[
          ["looksees", "My Looksees"],
          ["saved", "Saved"],
          ["points", "Points"],
          ["settings", "Settings"],
        ].map(([key, label]) => (
          <Link
            key={key}
            href={`/profile?tab=${key}`}
            className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold ${
              tab === key ? "bg-foreground text-white" : "bg-muted-bg"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        {tab === "looksees" ? (
          videos.length === 0 ? (
            <Empty
              title="You haven't posted a Looksee yet."
              actionHref="/upload"
              actionLabel="Upload a Looksee"
            />
          ) : (
            <ul className="space-y-3">
              {videos.map((video) => {
                const hostel = hostelLookup.get(video.hostel_id);
                return (
                  <li key={video.id} className="rounded-2xl bg-card p-4 ring-1 ring-border">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">
                        {CATEGORY_LABELS[video.category as VideoCategory] ?? video.category}
                      </p>
                      <StatusPill status={video.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {hostel?.name ?? "Hostel"} · Filmed {video.filmed_at}
                    </p>
                    {video.caption ? (
                      <p className="mt-2 text-sm">{video.caption}</p>
                    ) : null}
                    {hostel ? (
                      <Link
                        href={`/hostel/${hostel.slug}`}
                        className="mt-3 inline-block text-sm font-semibold text-accent"
                      >
                        View hostel
                      </Link>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )
        ) : null}

        {tab === "saved" ? (
          savedCards.length === 0 ? (
            <Empty
              title="Nothing saved yet."
              actionHref="/search"
              actionLabel="Browse hostels"
            />
          ) : (
            <div className="space-y-3">
              {savedCards.map((hostel) =>
                hostel ? <HostelCardView key={hostel.id} hostel={hostel} showSave /> : null,
              )}
            </div>
          )
        ) : null}

        {tab === "points" ? (
          points.length === 0 ? (
            <Empty
              title="No points activity yet."
              actionHref="/upload"
              actionLabel="Earn points by uploading"
            />
          ) : (
            <ul className="space-y-2">
              {points.map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl bg-card px-3 py-3 text-sm ring-1 ring-border"
                >
                  <span>{formatPointsLine(tx)}</span>
                  <span className="text-xs text-muted">{shortDate(tx.created_at)}</span>
                </li>
              ))}
            </ul>
          )
        ) : null}

        {tab === "settings" ? (
          profile ? (
            <ProfileSettingsForm
              initial={{
                first_name: profile.first_name ?? "",
                nationality: profile.nationality ?? "",
                current_city: profile.current_city ?? "",
                avatar_url: profile.avatar_url ?? "",
              }}
            />
          ) : (
            <p className="rounded-2xl bg-muted-bg px-4 py-6 text-sm text-muted">
              Profile is still syncing. Refresh in a moment.
            </p>
          )
        ) : null}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    errored: "Processing failed",
    processing: "Processing",
    uploading: "Uploading",
    ready: "Ready",
    hidden: "Hidden",
  };
  return (
    <span className="rounded-md bg-muted-bg px-2 py-0.5 text-[11px] font-semibold">
      {map[status] ?? status}
    </span>
  );
}

function Empty({
  title,
  actionHref,
  actionLabel,
}: {
  title: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="rounded-2xl bg-muted-bg px-4 py-10 text-center">
      <p className="font-semibold">{title}</p>
      <Link
        href={actionHref}
        className="mt-4 inline-flex h-10 items-center rounded-xl bg-accent px-4 text-sm font-bold text-white"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
