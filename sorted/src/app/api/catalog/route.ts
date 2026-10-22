import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/data/source";

export async function GET() {
  const catalog = await getCatalog();
  return NextResponse.json({
    restaurants: catalog.restaurants.filter((item) => item.active),
    bundles: catalog.bundles.filter((item) => item.active),
  });
}
