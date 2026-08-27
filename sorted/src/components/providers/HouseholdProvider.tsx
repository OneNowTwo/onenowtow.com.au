"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { getGuestId, readHousehold, subscribeKey, writeHousehold } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";
import type { HouseholdProfile } from "@/lib/types";

type HouseholdContextValue = {
  household: HouseholdProfile | null;
  ready: boolean;
  saveHousehold: (
    profile: Omit<HouseholdProfile, "id" | "created_at" | "user_id"> & { user_id?: string | null },
  ) => HouseholdProfile;
};

const HouseholdContext = createContext<HouseholdContextValue | null>(null);

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const household = useSyncExternalStore(
    (onStoreChange) => subscribeKey(STORAGE_KEYS.household, onStoreChange),
    readHousehold,
    () => null,
  );
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const saveHousehold = useCallback(
    (
      profile: Omit<HouseholdProfile, "id" | "created_at" | "user_id"> & {
        user_id?: string | null;
      },
    ) => {
      const current = readHousehold();
      const next: HouseholdProfile = {
        id: current?.id ?? crypto.randomUUID(),
        created_at: current?.created_at ?? new Date().toISOString(),
        user_id: profile.user_id ?? current?.user_id ?? null,
        household_name: profile.household_name,
        postcode: profile.postcode,
        adults: profile.adults,
        children: profile.children,
        dietary_requirements: profile.dietary_requirements,
        favourite_cuisines: profile.favourite_cuisines,
        avoided_foods: profile.avoided_foods,
        typical_budget: profile.typical_budget,
      };
      writeHousehold(next);
      getGuestId();
      return next;
    },
    [],
  );

  const value = useMemo(
    () => ({ household, ready: mounted, saveHousehold }),
    [household, mounted, saveHousehold],
  );

  return <HouseholdContext.Provider value={value}>{children}</HouseholdContext.Provider>;
}

export function useHousehold() {
  const ctx = useContext(HouseholdContext);
  if (!ctx) throw new Error("useHousehold must be used within HouseholdProvider");
  return ctx;
}
