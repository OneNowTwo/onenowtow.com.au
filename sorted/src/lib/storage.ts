import { STORAGE_KEYS } from "@/lib/constants";
import type { FavouriteRecord, HouseholdProfile, RecommendationSessionPayload, WeekPlanItem } from "@/lib/types";

const listeners = new Map<string, Set<() => void>>();

function emit(key: string): void {
  listeners.get(key)?.forEach((listener) => listener());
}

export function subscribeKey(key: string, onStoreChange: () => void): () => void {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(onStoreChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === key) onStoreChange();
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.get(key)?.delete(onStoreChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  emit(key);
}

export function getGuestId(): string {
  const existing = readJson<string | null>(STORAGE_KEYS.guestId, null);
  if (existing) return existing;
  const id = crypto.randomUUID();
  writeJson(STORAGE_KEYS.guestId, id);
  return id;
}

export function readHousehold(): HouseholdProfile | null {
  return readJson<HouseholdProfile | null>(STORAGE_KEYS.household, null);
}

export function writeHousehold(profile: HouseholdProfile): void {
  writeJson(STORAGE_KEYS.household, profile);
}

export function readFavourites(): FavouriteRecord[] {
  return readJson<FavouriteRecord[]>(STORAGE_KEYS.favourites, []);
}

export function writeFavourites(records: FavouriteRecord[]): void {
  writeJson(STORAGE_KEYS.favourites, records);
}

export function readWeek(): WeekPlanItem[] | null {
  return readJson<WeekPlanItem[] | null>(STORAGE_KEYS.week, null);
}

export function writeWeek(items: WeekPlanItem[]): void {
  writeJson(STORAGE_KEYS.week, items);
}

export function defaultWeek(): WeekPlanItem[] {
  return [
    { day: "MON", title: "Healthy Thai", price: 58, status: "sorted", bundleId: "00000000-0000-4000-b000-000000000001" },
    { day: "TUE", title: "Cooking at home", status: "home" },
    { day: "WED", title: "Italian Family Table", price: 64, status: "sorted", bundleId: "00000000-0000-4000-b000-000000000004" },
    { day: "THU", title: "Not planned", status: "unplanned" },
    { day: "FRI", title: "Treat night", status: "unplanned" },
    { day: "SAT", title: "Not planned", status: "unplanned" },
    { day: "SUN", title: "Not planned", status: "unplanned" },
  ];
}

export function readSession(): RecommendationSessionPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEYS.lastSession);
    return raw ? (JSON.parse(raw) as RecommendationSessionPayload) : null;
  } catch {
    return null;
  }
}

export function writeSession(session: RecommendationSessionPayload): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEYS.lastSession, JSON.stringify(session));
  emit(STORAGE_KEYS.lastSession);
}

export function subscribeSession(onStoreChange: () => void): () => void {
  return subscribeKey(STORAGE_KEYS.lastSession, onStoreChange);
}
