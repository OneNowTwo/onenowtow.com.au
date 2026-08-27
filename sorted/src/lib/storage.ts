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

// Cache household to return stable reference
let householdCache: HouseholdProfile | null | undefined = undefined;
let householdCacheKey: string | null | undefined = undefined;

export function readHousehold(): HouseholdProfile | null {
  if (typeof window === "undefined") {
    return householdCache !== undefined ? householdCache : (householdCache = null);
  }
  
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.household);
    if (raw === householdCacheKey && householdCache !== undefined) {
      return householdCache;
    }
    
    householdCacheKey = raw;
    if (!raw) {
      householdCache = null;
      return householdCache;
    }
    
    householdCache = JSON.parse(raw) as HouseholdProfile;
    return householdCache;
  } catch {
    householdCache = null;
    return householdCache;
  }
}

export function writeHousehold(profile: HouseholdProfile): void {
  writeJson(STORAGE_KEYS.household, profile);
  householdCache = undefined;
  householdCacheKey = undefined;
}

// Cache favourites to return stable reference
let favouritesCache: FavouriteRecord[] | null = null;
let favouritesCacheKey: string | null = null;

export function readFavourites(): FavouriteRecord[] {
  if (typeof window === "undefined") {
    return favouritesCache || (favouritesCache = []);
  }
  
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.favourites);
    if (raw === favouritesCacheKey && favouritesCache) {
      return favouritesCache;
    }
    
    favouritesCacheKey = raw;
    if (!raw) {
      favouritesCache = favouritesCache || [];
      return favouritesCache;
    }
    
    favouritesCache = JSON.parse(raw) as FavouriteRecord[];
    return favouritesCache;
  } catch {
    favouritesCache = favouritesCache || [];
    return favouritesCache;
  }
}

export function writeFavourites(records: FavouriteRecord[]): void {
  writeJson(STORAGE_KEYS.favourites, records);
  favouritesCache = null;
  favouritesCacheKey = null;
}

// Cache week to return stable reference
let weekCache: WeekPlanItem[] | null | undefined = undefined;
let weekCacheKey: string | null | undefined = undefined;

export function readWeek(): WeekPlanItem[] | null {
  if (typeof window === "undefined") {
    return weekCache !== undefined ? weekCache : (weekCache = null);
  }
  
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.week);
    if (raw === weekCacheKey && weekCache !== undefined) {
      return weekCache;
    }
    
    weekCacheKey = raw;
    if (!raw) {
      weekCache = null;
      return weekCache;
    }
    
    weekCache = JSON.parse(raw) as WeekPlanItem[];
    return weekCache;
  } catch {
    weekCache = null;
    return weekCache;
  }
}

export function writeWeek(items: WeekPlanItem[]): void {
  writeJson(STORAGE_KEYS.week, items);
  weekCache = undefined;
  weekCacheKey = undefined;
}

// Stable default week reference
const DEFAULT_WEEK: WeekPlanItem[] = [
  {
    day: "MON",
    title: "Healthy Thai",
    restaurant: "Bangkok Local",
    price: 58,
    status: "sorted",
    bundleId: "00000000-0000-4000-b000-000000000001",
  },
  { day: "TUE", title: "Cooking at home", status: "home" },
  {
    day: "WED",
    title: "Italian Family Table",
    restaurant: "Via Napoli Kitchen",
    price: 64,
    status: "sorted",
    bundleId: "00000000-0000-4000-b000-000000000004",
  },
  { day: "THU", title: "Not planned", status: "unplanned" },
  { day: "FRI", title: "Treat night", status: "unplanned" },
  { day: "SAT", title: "Not planned", status: "unplanned" },
  { day: "SUN", title: "Not planned", status: "unplanned" },
];

export function defaultWeek(): WeekPlanItem[] {
  return DEFAULT_WEEK;
}

// Cache session to return stable reference
let sessionCache: RecommendationSessionPayload | null | undefined = undefined;
let sessionCacheKey: string | null | undefined = undefined;

export function readSession(): RecommendationSessionPayload | null {
  if (typeof window === "undefined") {
    return sessionCache !== undefined ? sessionCache : (sessionCache = null);
  }
  
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEYS.lastSession);
    if (raw === sessionCacheKey && sessionCache !== undefined) {
      return sessionCache;
    }
    
    sessionCacheKey = raw;
    if (!raw) {
      sessionCache = null;
      return sessionCache;
    }
    
    sessionCache = JSON.parse(raw) as RecommendationSessionPayload;
    return sessionCache;
  } catch {
    sessionCache = null;
    return sessionCache;
  }
}

export function writeSession(session: RecommendationSessionPayload): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEYS.lastSession, JSON.stringify(session));
  sessionCache = undefined;
  sessionCacheKey = undefined;
  emit(STORAGE_KEYS.lastSession);
}

export function subscribeSession(onStoreChange: () => void): () => void {
  return subscribeKey(STORAGE_KEYS.lastSession, onStoreChange);
}
