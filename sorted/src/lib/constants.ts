export const MOODS = [
  { id: "quick", label: "Quick" },
  { id: "healthy", label: "Healthy" },
  { id: "cheap", label: "Cheap" },
  { id: "comfort", label: "Comfort" },
  { id: "treat", label: "Treat" },
  { id: "kids", label: "Kids' choice" },
  { id: "high-protein", label: "High protein" },
  { id: "surprise", label: "Surprise me" },
] as const;

export type MoodId = (typeof MOODS)[number]["id"];

export const DIETARY_OPTIONS = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten free" },
  { id: "dairy-free", label: "Dairy free" },
  { id: "nut-allergy", label: "Nut allergy" },
  { id: "no-seafood", label: "No seafood" },
  { id: "none", label: "None" },
] as const;

export type DietaryId = (typeof DIETARY_OPTIONS)[number]["id"];

export const CUISINES = [
  "Italian",
  "Thai",
  "Japanese",
  "Indian",
  "Chinese",
  "Vietnamese",
  "Greek",
  "Mexican",
  "Burgers",
  "Modern Australian",
  "Middle Eastern",
  "Healthy bowls",
] as const;

export type Cuisine = (typeof CUISINES)[number];

export const BUDGET_OPTIONS = [
  { id: "under-40", label: "Under $40", min: 0, max: 40 },
  { id: "40-60", label: "$40–$60", min: 40, max: 60 },
  { id: "60-80", label: "$60–$80", min: 60, max: 80 },
  { id: "80-100", label: "$80–$100", min: 80, max: 100 },
  { id: "100-plus", label: "$100+", min: 100, max: null },
] as const;

export const TONIGHT_BUDGET_OPTIONS = [
  { id: "under-40", label: "Under $40", min: 0, max: 40 },
  { id: "40-60", label: "$40–$60", min: 40, max: 60 },
  { id: "60-80", label: "$60–$80", min: 60, max: 80 },
  { id: "80-100", label: "$80–$100", min: 80, max: 100 },
  { id: "no-preference", label: "No preference", min: 0, max: null },
] as const;

export type BudgetId = (typeof BUDGET_OPTIONS)[number]["id"];
export type TonightBudgetId = (typeof TONIGHT_BUDGET_OPTIONS)[number]["id"];

export const ADULT_STEPS = [1, 2, 3, 4] as const;
export const CHILD_STEPS = [0, 1, 2, 3, 4] as const;

export const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

export const STORAGE_KEYS = {
  household: "sorted.household",
  favourites: "sorted.favourites",
  week: "sorted.week",
  lastSession: "sorted.lastSession",
  guestId: "sorted.guestId",
} as const;

export const ADMIN_COOKIE = "sorted_admin";
