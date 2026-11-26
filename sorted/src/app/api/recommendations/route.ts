import { NextResponse } from "next/server";
import { createRecommendationSession } from "@/lib/data/sessions";
import type { RecommendationInput } from "@/lib/types";

export async function POST(request: Request) {
  const input = (await request.json()) as RecommendationInput;
  if (!input?.postcode || input.adults == null) {
    return NextResponse.json({ error: "Missing dinner context" }, { status: 400 });
  }
  const session = await createRecommendationSession({
    ...input,
    adults: Number(input.adults),
    children: Number(input.children ?? 0),
    moodTags: input.moodTags ?? [],
    dietaryRequirements: input.dietaryRequirements ?? [],
    favouriteCuisines: input.favouriteCuisines ?? [],
    avoidedFoods: input.avoidedFoods ?? "",
  });
  return NextResponse.json(session);
}
