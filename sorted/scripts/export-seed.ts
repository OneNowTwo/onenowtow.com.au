import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { bundles, restaurants } from "../src/lib/data/catalog";

function sql(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    const inner = value.length
      ? value.map((item) => `'${String(item).replaceAll("'", "''")}'`).join(",")
      : "";
    return inner ? `ARRAY[${inner}]` : "ARRAY[]::text[]";
  }
  return `'${String(value).replaceAll("'", "''")}'`;
}

const restaurantRows = restaurants
  .map(
    (r) =>
      `  (${sql(r.id)}, ${sql(r.name)}, ${sql(r.slug)}, ${sql(r.description)}, ${sql(r.address)}, ${sql(r.suburb)}, ${sql(r.postcode)}, ${sql(r.cuisine)}, ${sql(r.image_url)}, ${sql(r.ordering_url)}, ${sql(r.official_url ?? "")}, ${sql(r.verified !== false)}, ${sql(r.dinner_suitable !== false)}, ${sql(r.opening_hours ?? "")}, ${sql(r.active)}, ${sql(r.created_at)})`,
  )
  .join(",\n");

const bundleRows = bundles
  .map(
    (b) =>
      `  (${sql(b.id)}, ${sql(b.restaurant_id)}, ${sql(b.name)}, ${sql(b.description)}, ${sql(b.price)}, ${sql(b.feeds_people)}, ${sql(b.estimated_minutes)}, ${sql(b.image_url)}, ${sql(b.active)}, ${sql(b.available_days)}, ${sql(b.tags)}, ${sql(b.dietary_tags)}, ${sql(b.is_concept_bundle !== false)}, ${sql(b.created_at)})`,
  )
  .join(",\n");

const output = `-- Auto-generated from src/lib/data/catalog.ts
-- ${restaurants.length} restaurants, ${bundles.length} dinner bundles
-- Restaurant names are real Manly venues; Sorted Packs and prices are prototype concepts.

insert into public.restaurants
  (id, name, slug, description, address, suburb, postcode, cuisine, image_url, ordering_url, official_url, verified, dinner_suitable, opening_hours, active, created_at)
values
${restaurantRows}
on conflict (id) do nothing;

insert into public.dinner_bundles
  (id, restaurant_id, name, description, price, feeds_people, estimated_minutes, image_url, active, available_days, tags, dietary_tags, is_concept_bundle, created_at)
values
${bundleRows}
on conflict (id) do nothing;
`;

const dest = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "supabase", "seed.sql");
writeFileSync(dest, output);
console.log(`Wrote ${dest}`);
