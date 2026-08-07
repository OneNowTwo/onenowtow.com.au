import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HostelCardView } from "@/components/hostel/HostelCard";
import { getSessionUser } from "@/lib/auth/session";
import { listSavedHostels } from "@/lib/db/engagement";
import { searchHostels } from "@/lib/db/queries";

export const metadata: Metadata = { title: "Saved hostels" };
export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/saved");

  const [saves, hostels] = await Promise.all([
    listSavedHostels(user.id),
    searchHostels(""),
  ]);

  const cards = saves
    .map((s) => hostels.find((h) => h.id === s.hostel_id))
    .filter((h): h is NonNullable<typeof h> => Boolean(h));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Saved</h1>
      <p className="mt-1 text-sm text-muted">Hostels you’re considering</p>

      <div className="mt-6 space-y-3">
        {cards.length === 0 ? (
          <div className="rounded-2xl bg-muted-bg px-4 py-10 text-center">
            <p className="font-semibold">Nothing saved yet.</p>
            <Link
              href="/search"
              className="mt-4 inline-flex h-10 items-center rounded-xl bg-accent px-4 text-sm font-bold text-white"
            >
              Browse hostels
            </Link>
          </div>
        ) : (
          cards.map((hostel) => (
            <HostelCardView key={hostel.id} hostel={hostel} showSave />
          ))
        )}
      </div>
    </div>
  );
}
