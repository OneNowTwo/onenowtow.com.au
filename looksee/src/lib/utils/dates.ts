import { formatDistanceToNowStrict, parseISO } from "date-fns";

export function filmedLabel(filmedAt: string): string {
  const date = parseISO(filmedAt);
  const distance = formatDistanceToNowStrict(date, { addSuffix: false });
  return `Filmed ${distance} ago`;
}

export function shortDate(iso: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parseISO(iso));
}
