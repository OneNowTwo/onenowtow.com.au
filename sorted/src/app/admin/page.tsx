"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Catalog, DinnerBundle, Restaurant } from "@/lib/types";

const emptyRestaurant = (): Restaurant => ({
  id: "",
  name: "",
  slug: "",
  description: "",
  address: "",
  suburb: "Manly",
  postcode: "2095",
  cuisine: "",
  image_url: "",
  ordering_url: "",
  official_url: "",
  verified: true,
  dinner_suitable: true,
  opening_hours: "",
  active: true,
  created_at: "",
});

const emptyBundle = (): DinnerBundle => ({
  id: "",
  restaurant_id: "",
  name: "",
  description: "",
  price: 50,
  feeds_people: 4,
  estimated_minutes: 30,
  image_url: "",
  active: true,
  available_days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
  tags: [],
  dietary_tags: [],
  is_concept_bundle: true,
  created_at: "",
});

export default function AdminPage() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [tab, setTab] = useState<"restaurants" | "bundles">("restaurants");
  const [restaurant, setRestaurant] = useState<Restaurant>(emptyRestaurant());
  const [bundle, setBundle] = useState<DinnerBundle>(emptyBundle());
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/admin/catalog");
    if (response.ok) setCatalog(await response.json());
  }

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/admin/catalog")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: Catalog | null) => {
        if (!cancelled && data) setCatalog(data);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const restaurantName = useMemo(() => {
    const map = new Map(catalog?.restaurants.map((item) => [item.id, item.name]));
    return (id: string) => map.get(id) ?? id;
  }, [catalog]);

  async function saveRestaurant() {
    const payload = {
      ...restaurant,
      slug: restaurant.slug || restaurant.name.toLowerCase().replace(/\s+/g, "-"),
    };
    const response = await fetch("/api/admin/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "restaurant", restaurant: payload }),
    });
    setMessage(response.ok ? "Restaurant saved." : "Save failed.");
    await load();
  }

  async function saveBundle() {
    const response = await fetch("/api/admin/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "bundle",
        bundle: {
          ...bundle,
          tags: String(bundle.tags).split(",").map((item) => item.trim()).filter(Boolean),
          dietary_tags: String(bundle.dietary_tags)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        },
      }),
    });
    setMessage(response.ok ? "Bundle saved." : "Save failed.");
    await load();
  }

  if (!catalog) {
    return <div className="p-8 font-sans text-sm">Loading admin…</div>;
  }

  return (
    <div className="min-h-full bg-neutral-100 p-6 font-sans text-sm text-neutral-900">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sorted admin</h1>
        <div className="flex gap-2">
          <Button
            variant={tab === "restaurants" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setTab("restaurants")}
          >
            Restaurants
          </Button>
          <Button
            variant={tab === "bundles" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setTab("bundles")}
          >
            Prototype Sorted Packs
          </Button>
        </div>
      </div>
      {message ? <p className="mb-4">{message}</p> : null}

      {tab === "restaurants" ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <table className="w-full border bg-white text-left">
            <thead>
              <tr className="border-b bg-neutral-50">
                <th className="p-2">Name</th>
                <th className="p-2">Suburb</th>
                <th className="p-2">Cuisine</th>
                <th className="p-2">Dinner</th>
                <th className="p-2">Verified</th>
                <th className="p-2">Active</th>
              </tr>
            </thead>
            <tbody>
              {catalog.restaurants.map((item) => (
                <tr
                  key={item.id}
                  className="cursor-pointer border-b hover:bg-neutral-50"
                  onClick={() => setRestaurant(item)}
                >
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.suburb}</td>
                  <td className="p-2">{item.cuisine}</td>
                  <td className="p-2">{item.dinner_suitable === false ? "no" : "yes"}</td>
                  <td className="p-2">{item.verified === false ? "no" : "yes"}</td>
                  <td className="p-2">{item.active ? "yes" : "no"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <form
            className="space-y-2 rounded border bg-white p-4"
            onSubmit={(event) => {
              event.preventDefault();
              void saveRestaurant();
            }}
          >
            <h2 className="font-semibold">{restaurant.id ? "Edit restaurant" : "Add restaurant"}</h2>
            {(
              [
                ["name", "Name"],
                ["slug", "Slug"],
                ["suburb", "Suburb"],
                ["postcode", "Postcode"],
                ["cuisine", "Cuisine"],
                ["address", "Address"],
                ["image_url", "Image URL"],
                ["official_url", "Official URL"],
                ["ordering_url", "Ordering URL (verified only)"],
                ["opening_hours", "Opening hours"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block">
                {label}
                <input
                  className="mt-1 w-full border px-2 py-1"
                  value={String(restaurant[key] ?? "")}
                  onChange={(event) =>
                    setRestaurant((current) => ({ ...current, [key]: event.target.value }))
                  }
                />
              </label>
            ))}
            <label className="block">
              Description
              <textarea
                className="mt-1 w-full border px-2 py-1"
                value={restaurant.description}
                onChange={(event) =>
                  setRestaurant((current) => ({ ...current, description: event.target.value }))
                }
              />
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={restaurant.active}
                onChange={(event) =>
                  setRestaurant((current) => ({ ...current, active: event.target.checked }))
                }
              />
              Active
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={restaurant.verified !== false}
                onChange={(event) =>
                  setRestaurant((current) => ({ ...current, verified: event.target.checked }))
                }
              />
              Restaurant verified
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={restaurant.dinner_suitable !== false}
                onChange={(event) =>
                  setRestaurant((current) => ({ ...current, dinner_suitable: event.target.checked }))
                }
              />
              Dinner suitable
            </label>
            <div className="flex gap-2">
              <Button type="submit" size="sm">Save</Button>
              <Button type="button" size="sm" variant="secondary" onClick={() => setRestaurant(emptyRestaurant())}>
                New
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <table className="w-full border bg-white text-left">
            <thead>
              <tr className="border-b bg-neutral-50">
                <th className="p-2">Prototype Sorted Pack</th>
                <th className="p-2">Restaurant</th>
                <th className="p-2">Concept price</th>
                <th className="p-2">Concept</th>
                <th className="p-2">Active</th>
              </tr>
            </thead>
            <tbody>
              {catalog.bundles.map((item) => (
                <tr
                  key={item.id}
                  className="cursor-pointer border-b hover:bg-neutral-50"
                  onClick={() => setBundle(item)}
                >
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{restaurantName(item.restaurant_id)}</td>
                  <td className="p-2">${item.price}</td>
                  <td className="p-2">{item.is_concept_bundle !== false ? "yes" : "no"}</td>
                  <td className="p-2">{item.active ? "yes" : "no"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <form
            className="space-y-2 rounded border bg-white p-4"
            onSubmit={(event) => {
              event.preventDefault();
              void saveBundle();
            }}
          >
            <h2 className="font-semibold">
              {bundle.id ? "Edit prototype Sorted Pack" : "Add prototype Sorted Pack"}
            </h2>
            <label className="block">
              Restaurant
              <select
                className="mt-1 w-full border px-2 py-1"
                value={bundle.restaurant_id}
                onChange={(event) =>
                  setBundle((current) => ({ ...current, restaurant_id: event.target.value }))
                }
              >
                <option value="">Select</option>
                {catalog.restaurants.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              Name
              <input
                className="mt-1 w-full border px-2 py-1"
                value={bundle.name}
                onChange={(event) => setBundle((current) => ({ ...current, name: event.target.value }))}
              />
            </label>
            <label className="block">
              Description
              <textarea
                className="mt-1 w-full border px-2 py-1"
                value={bundle.description}
                onChange={(event) =>
                  setBundle((current) => ({ ...current, description: event.target.value }))
                }
              />
            </label>
            <label className="block">
              Concept price
              <input
                type="number"
                className="mt-1 w-full border px-2 py-1"
                value={bundle.price}
                onChange={(event) =>
                  setBundle((current) => ({ ...current, price: Number(event.target.value) }))
                }
              />
            </label>
            <label className="block">
              Feeds
              <input
                type="number"
                className="mt-1 w-full border px-2 py-1"
                value={bundle.feeds_people}
                onChange={(event) =>
                  setBundle((current) => ({ ...current, feeds_people: Number(event.target.value) }))
                }
              />
            </label>
            <label className="block">
              Minutes
              <input
                type="number"
                className="mt-1 w-full border px-2 py-1"
                value={bundle.estimated_minutes}
                onChange={(event) =>
                  setBundle((current) => ({
                    ...current,
                    estimated_minutes: Number(event.target.value),
                  }))
                }
              />
            </label>
            <label className="block">
              Image URL
              <input
                className="mt-1 w-full border px-2 py-1"
                value={bundle.image_url}
                onChange={(event) =>
                  setBundle((current) => ({ ...current, image_url: event.target.value }))
                }
              />
            </label>
            <label className="block">
              Tags (comma)
              <input
                className="mt-1 w-full border px-2 py-1"
                value={Array.isArray(bundle.tags) ? bundle.tags.join(", ") : String(bundle.tags)}
                onChange={(event) =>
                  setBundle((current) => ({
                    ...current,
                    tags: event.target.value.split(",") as unknown as string[],
                  }))
                }
              />
            </label>
            <label className="block">
              Dietary tags (comma)
              <input
                className="mt-1 w-full border px-2 py-1"
                value={
                  Array.isArray(bundle.dietary_tags)
                    ? bundle.dietary_tags.join(", ")
                    : String(bundle.dietary_tags)
                }
                onChange={(event) =>
                  setBundle((current) => ({
                    ...current,
                    dietary_tags: event.target.value.split(",") as unknown as string[],
                  }))
                }
              />
            </label>
            <label className="block">
              Available days (comma)
              <input
                className="mt-1 w-full border px-2 py-1"
                value={
                  Array.isArray(bundle.available_days)
                    ? bundle.available_days.join(", ")
                    : String(bundle.available_days)
                }
                onChange={(event) =>
                  setBundle((current) => ({
                    ...current,
                    available_days: event.target.value.split(",").map((item) => item.trim()) as string[],
                  }))
                }
              />
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bundle.active}
                onChange={(event) =>
                  setBundle((current) => ({ ...current, active: event.target.checked }))
                }
              />
              Active
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bundle.is_concept_bundle !== false}
                onChange={(event) =>
                  setBundle((current) => ({ ...current, is_concept_bundle: event.target.checked }))
                }
              />
              Concept bundle
            </label>
            <div className="flex gap-2">
              <Button type="submit" size="sm">Save</Button>
              <Button type="button" size="sm" variant="secondary" onClick={() => setBundle(emptyBundle())}>
                New
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
