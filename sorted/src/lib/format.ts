export function formatPrice(amount: number): string {
  return `$${Math.round(amount)}`;
}

export function formatPeople(adults: number, children: number): string {
  const adultLabel = adults >= 4 ? "4+ adults" : `${adults} adult${adults === 1 ? "" : "s"}`;
  if (children <= 0) return adultLabel;
  const childLabel = children >= 4 ? "4+ kids" : `${children} kid${children === 1 ? "" : "s"}`;
  return `${adultLabel}, ${childLabel}`;
}

export function formatFeeds(n: number): string {
  return `Feeds ${n}`;
}

export function formatMinutes(n: number): string {
  return `${n} min`;
}

export function budgetIdToRange(id: string): { min: number | null; max: number | null } {
  switch (id) {
    case "under-40":
      return { min: 0, max: 40 };
    case "40-60":
      return { min: 40, max: 60 };
    case "60-80":
      return { min: 60, max: 80 };
    case "80-100":
      return { min: 80, max: 100 };
    case "100-plus":
      return { min: 100, max: null };
    default:
      return { min: 0, max: null };
  }
}
