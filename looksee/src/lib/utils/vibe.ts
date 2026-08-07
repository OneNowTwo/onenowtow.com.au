export type VibeLabel = "Party" | "Social" | "Mixed" | "Chill" | "Quiet";

export function vibeLabel(score: number | null | undefined): VibeLabel {
  if (score == null) return "Mixed";
  if (score <= 20) return "Party";
  if (score <= 40) return "Social";
  if (score <= 60) return "Mixed";
  if (score <= 80) return "Chill";
  return "Quiet";
}

export function vibePosition(score: number | null | undefined): number {
  if (score == null) return 50;
  return Math.min(100, Math.max(0, score));
}
