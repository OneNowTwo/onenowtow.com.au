import type { Metadata } from "next";
import { SearchView } from "@/components/search/SearchView";
import { searchHostels } from "@/lib/db/queries";
import type { SearchFilter } from "@/lib/constants";
import { SEARCH_FILTERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Search hostels",
  description: "Search destinations and hostels by name. Filter by vibe, rating and recent Looksees.",
};

type Props = {
  searchParams: Promise<{ q?: string; filters?: string }>;
};

function parseFilters(raw?: string): SearchFilter[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((f) => f.trim())
    .filter((f): f is SearchFilter => (SEARCH_FILTERS as readonly string[]).includes(f));
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q ?? "";
  const filters = parseFilters(params.filters);
  const results = await searchHostels(query, filters);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <SearchView initialQuery={query} initialFilters={filters} results={results} />
    </div>
  );
}
