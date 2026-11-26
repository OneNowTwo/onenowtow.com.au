import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/constants";
import { getCatalog, upsertLocalBundle, upsertLocalRestaurant } from "@/lib/data/source";
import { isSupabaseAdminConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import type { DinnerBundle, Restaurant } from "@/lib/types";

async function requireAdmin() {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === "1";
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const catalog = await getCatalog();
  return NextResponse.json(catalog);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as {
    type: "restaurant" | "bundle";
    restaurant?: Restaurant;
    bundle?: DinnerBundle;
  };

  if (body.type === "restaurant" && body.restaurant) {
    const restaurant: Restaurant = {
      ...body.restaurant,
      id: body.restaurant.id || crypto.randomUUID(),
      created_at: body.restaurant.created_at || new Date().toISOString(),
    };
    if (isSupabaseAdminConfigured()) {
      const supabase = createAdminClient();
      const { error } = await supabase.from("restaurants").upsert(restaurant);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    } else {
      upsertLocalRestaurant(restaurant);
    }
    return NextResponse.json({ restaurant });
  }

  if (body.type === "bundle" && body.bundle) {
    const bundle: DinnerBundle = {
      ...body.bundle,
      id: body.bundle.id || crypto.randomUUID(),
      created_at: body.bundle.created_at || new Date().toISOString(),
      available_days: body.bundle.available_days?.length
        ? body.bundle.available_days
        : ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
      tags: body.bundle.tags ?? [],
      dietary_tags: body.bundle.dietary_tags ?? [],
    };
    if (isSupabaseAdminConfigured()) {
      const supabase = createAdminClient();
      const { error } = await supabase.from("dinner_bundles").upsert(bundle);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    } else {
      upsertLocalBundle(bundle);
    }
    return NextResponse.json({ bundle });
  }

  return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
}
