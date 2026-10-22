import { getLocalCatalog } from "../src/lib/data/catalog.ts";

const catalog = getLocalCatalog();
const urls = [...new Set(catalog.bundles.map((b) => b.image_url))];
console.log(`packs ${catalog.bundles.length} unique images ${urls.length}`);

async function check(url) {
  const res = await fetch(url, { method: "GET", redirect: "follow" });
  return { url, status: res.status, ok: res.ok };
}

const dead = [];
for (let i = 0; i < urls.length; i += 8) {
  const batch = await Promise.all(urls.slice(i, i + 8).map(check));
  for (const item of batch) {
    process.stdout.write(item.ok ? "." : "x");
    if (!item.ok) dead.push(item);
  }
}
console.log(`\ndead ${dead.length}`);
for (const item of dead) console.log(item.status, item.url);

const names = [
  "Grilled Fish Wharf Table",
  "Bistro Grilled Fish Table",
  "Yok Seafood Celebration",
  "Tandoori Dinner for Two",
  "Quick Chicken Salad Pair",
  "Grilled Chicken & Greens",
];
console.log("\nProblem packs:");
for (const name of names) {
  const pack = catalog.bundles.find((b) => b.name === name);
  const restaurant = catalog.restaurants.find((r) => r.id === pack?.restaurant_id);
  console.log(`${name} | ${restaurant?.name} | ${restaurant?.cuisine}\n  ${pack?.image_url}`);
}
