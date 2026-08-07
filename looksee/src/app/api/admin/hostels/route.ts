import { NextResponse } from "next/server";
import { AuthError, requireAdmin } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { hostelAdminSchema } from "@/lib/validation/mvp";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const parsed = hostelAdminSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid hostel" },
        { status: 400 },
      );
    }
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("hostels")
      .insert({
        ...parsed.data,
        video_count: 0,
        active: parsed.data.active ?? true,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ hostel: data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Could not create hostel";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = z
      .object({
        id: z.string().min(8),
        active: z.boolean().optional(),
        name: z.string().optional(),
        preferred_booking_url: z.string().url().optional().nullable(),
        hero_image_url: z.string().url().optional().nullable(),
        address: z.string().optional().nullable(),
      })
      .safeParse(await request.json());

    if (!body.success) {
      return NextResponse.json({ error: "Invalid update" }, { status: 400 });
    }

    const { id, ...patch } = body.data;
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("hostels")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ hostel: data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Could not update hostel";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
