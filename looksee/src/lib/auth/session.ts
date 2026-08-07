import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/env";
import type { Profile, UserRole } from "@/lib/types/database";

export type SessionUser = {
  id: string;
  email: string;
  profile: Profile | null;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // Safety net if the auth.users trigger did not create a row yet.
  if (!profile) {
    profile = await ensureProfileRow(user);
  }

  return {
    id: user.id,
    email: user.email ?? "",
    profile: (profile as Profile | null) ?? null,
  };
}

async function ensureProfileRow(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): Promise<Profile | null> {
  try {
    const admin = createAdminClient();
    const meta = user.user_metadata ?? {};
    const fullName =
      (typeof meta.full_name === "string" && meta.full_name) ||
      (typeof meta.name === "string" && meta.name) ||
      "";
    const firstName =
      (typeof meta.given_name === "string" && meta.given_name) ||
      (typeof meta.first_name === "string" && meta.first_name) ||
      (fullName ? fullName.split(" ")[0] : null) ||
      (user.email ? user.email.split("@")[0] : null);
    const avatar =
      (typeof meta.avatar_url === "string" && meta.avatar_url) ||
      (typeof meta.picture === "string" && meta.picture) ||
      null;

    const { data, error } = await admin
      .from("profiles")
      .upsert(
        {
          id: user.id,
          email: user.email ?? "",
          first_name: firstName,
          avatar_url: avatar,
        },
        { onConflict: "id", ignoreDuplicates: true },
      )
      .select("*")
      .maybeSingle();

    if (error) {
      const { data: existing } = await admin
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      return (existing as Profile | null) ?? null;
    }

    if (data) return data as Profile;

    const { data: existing } = await admin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    return (existing as Profile | null) ?? null;
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new AuthError("Sign in required");
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.profile?.role !== "admin") {
    throw new AuthError("Admin access required", 403);
  }
  return user;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

export async function updateOwnProfile(
  userId: string,
  patch: {
    first_name?: string | null;
    avatar_url?: string | null;
    nationality?: string | null;
    current_city?: string | null;
  },
): Promise<Profile> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Profile;
}

/** Service-role only — promote first admin during setup scripts. */
export async function setUserRole(userId: string, role: UserRole): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ role }).eq("id", userId);
  if (error) throw new Error(error.message);
}
