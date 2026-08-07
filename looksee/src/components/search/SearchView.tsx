"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { HostelCardView } from "@/components/hostel/HostelCard";
import {
  SEARCH_FILTER_LABELS,
  SEARCH_FILTERS,
  type SearchFilter,
} from "@/lib/constants";
import type { HostelCard } from "@/lib/types/views";
import { cn } from "@/lib/utils/cn";
import { track } from "@/lib/analytics/posthog";

type Props = {
  initialQuery: string;
  initialFilters: SearchFilter[];
  results: HostelCard[];
};

export function SearchView({ initialQuery, initialFilters, results }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilter[]>(initialFilters);
  const [isPending, startTransition] = useTransition();

  function navigate(nextQuery: string, nextFilters: SearchFilter[]) {
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextFilters.length) params.set("filters", nextFilters.join(","));
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/search?${qs}` : "/search");
    });
    track("search_performed", {
      query: nextQuery.trim() || null,
      filters: nextFilters.join(",") || null,
    });
  }

  function toggleFilter(filter: SearchFilter) {
    const next = filters.includes(filter)
      ? filters.filter((f) => f !== filter)
      : [...filters, filter];
    setFilters(next);
    navigate(query, next);
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Search</h1>
      <p className="mt-1 text-sm text-muted">Find a destination or hostel</p>

      <form
        className="mt-5"
        onSubmit={(e) => {
          e.preventDefault();
          navigate(query, filters);
        }}
      >
        <label htmlFor="search-q" className="sr-only">
          Search hostels and destinations
        </label>
        <div className="flex items-center gap-2 rounded-2xl bg-card p-2 ring-1 ring-border">
          <Search className="ml-2 h-5 w-5 shrink-0 text-muted" />
          <input
            id="search-q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Destination or hostel name"
            className="h-11 w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            className="h-11 shrink-0 rounded-xl bg-accent px-4 text-sm font-bold text-white hover:bg-accent-hover"
          >
            Go
          </button>
        </div>
      </form>

      <div className="scrollbar-none mt-4 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {SEARCH_FILTERS.map((filter) => {
          const active = filters.includes(filter);
          return (
            <button
              key={filter}
              type="button"
              onClick={() => toggleFilter(filter)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition",
                active
                  ? "bg-foreground text-white"
                  : "bg-muted-bg text-foreground/80 hover:bg-border",
              )}
            >
              {SEARCH_FILTER_LABELS[filter]}
            </button>
          );
        })}
      </div>

      <div className={cn("mt-6 space-y-3", isPending && "opacity-60")}>
        <p className="text-sm text-muted">
          {results.length} {results.length === 1 ? "hostel" : "hostels"}
          {initialQuery ? ` for “${initialQuery}”` : ""}
        </p>
        {results.length === 0 ? (
          <div className="rounded-2xl bg-muted-bg px-4 py-10 text-center">
            <p className="font-semibold">No hostels found</p>
            <p className="mt-1 text-sm text-muted">
              Try another destination — Sydney, Byron Bay, Cairns…
            </p>
          </div>
        ) : (
          results.map((hostel) => <HostelCardView key={hostel.id} hostel={hostel} />)
        )}
      </div>
    </div>
  );
}
