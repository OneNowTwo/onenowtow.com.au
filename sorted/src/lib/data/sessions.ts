import { isSupabaseConfigured } from "@/lib/env";
import { recommend } from "@/lib/recommendation/engine";
import { createClient } from "@/lib/supabase/server";
import type { RecommendationInput, RecommendationSessionPayload } from "@/lib/types";
import { getCatalog } from "@/lib/data/source";

const memory = new Map<string, RecommendationSessionPayload>();

function newId(): string {
  return crypto.randomUUID();
}

export async function createRecommendationSession(
  input: RecommendationInput,
): Promise<RecommendationSessionPayload> {
  const catalog = await getCatalog();
  const results = recommend(input, catalog);
  const session: RecommendationSessionPayload = {
    id: newId(),
    input,
    results,
    createdAt: new Date().toISOString(),
  };
  memory.set(session.id, session);
  await persistSession(session);
  return session;
}

export async function refreshRecommendationSession(
  sessionId: string,
): Promise<RecommendationSessionPayload | null> {
  const existing = memory.get(sessionId);
  if (!existing) return null;
  const excludeBundleIds = [
    ...(existing.input.excludeBundleIds ?? []),
    ...existing.results.map((r) => r.bundle.id),
  ];
  const input: RecommendationInput = { ...existing.input, excludeBundleIds };
  const catalog = await getCatalog();
  const results = recommend(input, catalog);
  const session: RecommendationSessionPayload = {
    ...existing,
    input,
    results,
    createdAt: new Date().toISOString(),
  };
  memory.set(session.id, session);
  return session;
}

export function getSession(id: string): RecommendationSessionPayload | undefined {
  return memory.get(id);
}

export function putSession(session: RecommendationSessionPayload): void {
  memory.set(session.id, session);
}

async function persistSession(session: RecommendationSessionPayload): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = await createClient();
    const { data: inserted, error } = await supabase
      .from("recommendation_sessions")
      .insert({
        user_id: session.input.userId ?? null,
        household_id: session.input.householdId ?? null,
        postcode: session.input.postcode,
        adults: session.input.adults,
        children: session.input.children,
        mood_tags: session.input.moodTags,
        budget_min: session.input.budgetMin ?? null,
        budget_max: session.input.budgetMax ?? null,
        notes: session.input.notes ?? null,
      })
      .select("id")
      .single();
    if (error || !inserted) return;
    await supabase.from("recommendation_results").insert(
      session.results.map((result) => ({
        session_id: inserted.id,
        dinner_bundle_id: result.bundle.id,
        rank: result.rank,
        score: result.score,
        reason: result.reason,
        selected: false,
      })),
    );
  } catch {
    // Local memory remains the source of truth for the MVP request lifecycle.
  }
}
