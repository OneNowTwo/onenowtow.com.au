import type { RecommendedDinner } from "@/lib/types";

export type AlternativeRole = "Healthier pick" | "Safe family pick" | "Best value" | "Quickest";

function tagsOf(item: RecommendedDinner): string[] {
  return item.bundle.tags.map((tag) => tag.toLowerCase().replaceAll("_", "-"));
}

function healthierScore(item: RecommendedDinner): number {
  const tags = tagsOf(item);
  let score = 0;
  if (tags.includes("healthy")) score += 5;
  if (tags.includes("high-protein")) score += 3;
  if (tags.includes("treat") || tags.includes("burgers")) score -= 2;
  return score;
}

function familyScore(item: RecommendedDinner): number {
  const tags = tagsOf(item);
  let score = 0;
  if (tags.includes("kids") || tags.includes("family")) score += 5;
  if (tags.includes("comfort")) score += 2;
  return score;
}

/**
 * Assign distinctive presentation labels to the 2nd and 3rd results.
 * Does not change rank or score — primary remains results[0].
 */
export function labelAlternatives(results: RecommendedDinner[]): Map<string, AlternativeRole> {
  const labels = new Map<string, AlternativeRole>();
  const alts = results.slice(1);
  if (alts.length === 0) return labels;

  const group = results;
  const minPrice = Math.min(...group.map((item) => item.bundle.price));
  const minMinutes = Math.min(...group.map((item) => item.bundle.estimated_minutes));

  const roles: Array<{
    label: AlternativeRole;
    score: (item: RecommendedDinner) => number;
  }> = [
    { label: "Healthier pick", score: healthierScore },
    { label: "Safe family pick", score: familyScore },
    {
      label: "Best value",
      score: (item) => (item.bundle.price === minPrice ? 6 : 40 - item.bundle.price / 2),
    },
    {
      label: "Quickest",
      score: (item) =>
        item.bundle.estimated_minutes === minMinutes ? 6 : 40 - item.bundle.estimated_minutes,
    },
  ];

  const pairs = alts.flatMap((item) =>
    roles.map((role) => ({
      id: item.bundle.id,
      label: role.label,
      score: role.score(item),
    })),
  );

  pairs.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));

  const usedRoles = new Set<AlternativeRole>();
  for (const pair of pairs) {
    if (labels.has(pair.id) || usedRoles.has(pair.label)) continue;
    labels.set(pair.id, pair.label);
    usedRoles.add(pair.label);
    if (labels.size === alts.length) break;
  }

  for (const alt of alts) {
    if (labels.has(alt.bundle.id)) continue;
    const leftover = roles.find((role) => !usedRoles.has(role.label));
    if (leftover) {
      labels.set(alt.bundle.id, leftover.label);
      usedRoles.add(leftover.label);
    }
  }

  return labels;
}
