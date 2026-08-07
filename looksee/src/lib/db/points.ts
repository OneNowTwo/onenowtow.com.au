import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { PointsTransaction, PointsType } from "@/lib/types/database";

export const POINTS_LABELS: Record<PointsType, string> = {
  video_approved: "Hostel video approved",
  helpful_10: "Video helped 10 travellers",
  helpful_50: "Video helped 50 travellers",
  first_upload_bonus: "First Looksee bonus",
  admin_adjustment: "Admin adjustment",
  redemption: "Reward redemption",
};

export async function listPointsForUser(userId: string): Promise<PointsTransaction[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("points_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return (data ?? []) as PointsTransaction[];
}

/** Service-role award used when RPC unavailable. Idempotent. */
export async function awardPointsAdmin(input: {
  userId: string;
  amount: number;
  type: PointsType;
  referenceId: string;
  description: string;
}): Promise<boolean> {
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("points_transactions")
    .select("id")
    .eq("user_id", input.userId)
    .eq("type", input.type)
    .eq("reference_id", input.referenceId)
    .maybeSingle();

  if (existing) return false;

  const { error: txError } = await admin.from("points_transactions").insert({
    user_id: input.userId,
    amount: input.amount,
    type: input.type,
    reference_id: input.referenceId,
    description: input.description,
  });

  if (txError) {
    if (txError.code === "23505") return false;
    throw new Error(txError.message);
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("points_balance")
    .eq("id", input.userId)
    .single();

  const balance = (profile?.points_balance as number | undefined) ?? 0;
  const { error: balError } = await admin
    .from("profiles")
    .update({ points_balance: balance + input.amount })
    .eq("id", input.userId);

  if (balError) throw new Error(balError.message);
  return true;
}

export function formatPointsLine(tx: PointsTransaction): string {
  const sign = tx.amount >= 0 ? "+" : "";
  const label = POINTS_LABELS[tx.type] ?? tx.description;
  return `${sign}${tx.amount} — ${label}`;
}
