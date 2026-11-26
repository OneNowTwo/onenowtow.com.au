"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import { STORAGE_KEYS } from "@/lib/constants";
import { readFavourites, subscribeKey, writeFavourites } from "@/lib/storage";
import type { FavouriteRecord } from "@/lib/types";

type FavouritesContextValue = {
  favourites: FavouriteRecord[];
  ready: boolean;
  isSaved: (bundleId: string) => boolean;
  toggle: (bundleId: string) => void;
};

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

// Stable reference for SSR to avoid infinite loop
const SSR_FAVOURITES: FavouriteRecord[] = [];

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const favourites = useSyncExternalStore(
    (onStoreChange) => subscribeKey(STORAGE_KEYS.favourites, onStoreChange),
    readFavourites,
    () => SSR_FAVOURITES,
  );
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const isSaved = useCallback(
    (bundleId: string) => favourites.some((item) => item.dinner_bundle_id === bundleId),
    [favourites],
  );

  const toggle = useCallback((bundleId: string) => {
    const current = readFavourites();
    const exists = current.some((item) => item.dinner_bundle_id === bundleId);
    const next = exists
      ? current.filter((item) => item.dinner_bundle_id !== bundleId)
      : [
          ...current,
          {
            id: crypto.randomUUID(),
            dinner_bundle_id: bundleId,
            created_at: new Date().toISOString(),
          },
        ];
    writeFavourites(next);
    if (!exists) track("favourite_saved", { bundleId });
  }, []);

  const value = useMemo(
    () => ({ favourites, ready: mounted, isSaved, toggle }),
    [favourites, mounted, isSaved, toggle],
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be used within FavouritesProvider");
  return ctx;
}
