"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Destination, Hostel } from "@/lib/types/database";

type Props = {
  hostels: Hostel[];
  destinations: Destination[];
};

export function AdminHostels({ hostels, destinations }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    destination_id: destinations[0]?.id ?? "",
    name: "",
    slug: "",
    preferred_booking_url: "",
    hero_image_url: "",
    address: "",
  });

  async function createHostel(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/hostels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        active: true,
      }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "Could not create hostel");
      return;
    }
    setForm((f) => ({ ...f, name: "", slug: "", preferred_booking_url: "", hero_image_url: "", address: "" }));
    router.refresh();
  }

  async function toggleActive(hostel: Hostel) {
    await fetch("/api/admin/hostels", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: hostel.id, active: !hostel.active }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={(e) => void createHostel(e)} className="space-y-2 rounded-2xl bg-muted-bg p-4">
        <h2 className="font-bold">Add hostel</h2>
        <select
          value={form.destination_id}
          onChange={(e) => setForm((f) => ({ ...f, destination_id: e.target.value }))}
          className="h-10 w-full rounded-lg bg-card px-2 text-sm ring-1 ring-border"
        >
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        {(
          [
            ["name", "Name"],
            ["slug", "Slug"],
            ["address", "Address"],
            ["hero_image_url", "Hero image URL"],
            ["preferred_booking_url", "Booking URL"],
          ] as const
        ).map(([key, label]) => (
          <input
            key={key}
            required={key === "name" || key === "slug"}
            placeholder={label}
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="h-10 w-full rounded-lg bg-card px-2 text-sm ring-1 ring-border"
          />
        ))}
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <button type="submit" className="h-10 rounded-xl bg-accent px-4 text-sm font-bold text-white">
          Create
        </button>
      </form>

      <ul className="space-y-2">
        {hostels.map((hostel) => (
          <li
            key={hostel.id}
            className="flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-3 text-sm ring-1 ring-border"
          >
            <div>
              <p className="font-semibold">{hostel.name}</p>
              <p className="text-xs text-muted">
                {hostel.slug} · {hostel.active ? "active" : "inactive"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void toggleActive(hostel)}
              className="h-9 rounded-lg bg-muted-bg px-3 text-xs font-bold"
            >
              {hostel.active ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
