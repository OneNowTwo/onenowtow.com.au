export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  suburb: string;
  postcode: string;
  cuisine: string;
  image_url: string;
  ordering_url: string;
  active: boolean;
  created_at: string;
}

export interface DinnerBundle {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  feeds_people: number;
  estimated_minutes: number;
  image_url: string;
  active: boolean;
  available_days: string[];
  tags: string[];
  dietary_tags: string[];
  created_at: string;
}

export interface HouseholdProfile {
  id: string;
  user_id: string | null;
  household_name: string;
  postcode: string;
  adults: number;
  children: number;
  dietary_requirements: string[];
  favourite_cuisines: string[];
  avoided_foods: string;
  typical_budget: string;
  created_at: string;
}

export interface RecommendationInput {
  postcode: string;
  suburb?: string;
  adults: number;
  children: number;
  dietaryRequirements: string[];
  favouriteCuisines: string[];
  avoidedFoods: string;
  moodTags: string[];
  budgetMin?: number | null;
  budgetMax?: number | null;
  notes?: string;
  excludeBundleIds?: string[];
  householdId?: string | null;
  userId?: string | null;
}

export interface RecommendedDinner {
  bundle: DinnerBundle;
  restaurant: Restaurant;
  score: number;
  reason: string;
  rank: number;
}

export interface RecommendationSessionPayload {
  id: string;
  input: RecommendationInput;
  results: RecommendedDinner[];
  createdAt: string;
}

export interface FavouriteRecord {
  id: string;
  dinner_bundle_id: string;
  created_at: string;
}

export interface WeekPlanItem {
  day: string;
  title: string;
  price?: number;
  status: "sorted" | "home" | "unplanned";
  bundleId?: string;
}

export interface Catalog {
  restaurants: Restaurant[];
  bundles: DinnerBundle[];
}

export interface JoinedBundle {
  bundle: DinnerBundle;
  restaurant: Restaurant;
}
